const { pool } = require('../config/db');
const { cacheDel } = require('../config/redis');
const ApiError = require('../utils/ApiError');
const { v4: uuidv4 } = require('uuid');
const { logActivity } = require('../services/activity');

exports.list = async (req, res) => {
  const { type } = req.query;
  const params = [];
  let sql = `SELECT o.*, u.name AS created_by_name, s.name AS supplier_name
             FROM orders o
             LEFT JOIN users u ON u.id = o.created_by
             LEFT JOIN suppliers s ON s.id = o.supplier_id`;
  if (type) { sql += ' WHERE o.type=?'; params.push(type); }
  sql += ' ORDER BY o.id DESC';
  const [rows] = await pool.query(sql, params);
  res.json(rows);
};

exports.get = async (req, res) => {
  const [orders] = await pool.query('SELECT * FROM orders WHERE id=?', [req.params.id]);
  if (!orders[0]) throw new ApiError(404, 'Order not found');
  const [items] = await pool.query(
    `SELECT oi.*, p.name AS product_name, p.sku FROM order_items oi
     JOIN products p ON p.id = oi.product_id WHERE oi.order_id=?`,
    [req.params.id]
  );
  res.json({ ...orders[0], items });
};

exports.create = async (req, res) => {
  const { type, supplier_id, customer_name, items } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const total = items.reduce((s, i) => s + i.quantity * i.unit_price, 0);
    const orderNo = `${type.toUpperCase().slice(0,3)}-${uuidv4().slice(0,8).toUpperCase()}`;
    const [r] = await conn.query(
      `INSERT INTO orders (order_no,type,status,supplier_id,customer_name,total_amount,created_by)
       VALUES (?,?,?,?,?,?,?)`,
      [orderNo, type, 'pending', supplier_id || null, customer_name || null, total, req.user.id]
    );
    for (const it of items) {
      await conn.query(
        'INSERT INTO order_items (order_id,product_id,quantity,unit_price) VALUES (?,?,?,?)',
        [r.insertId, it.product_id, it.quantity, it.unit_price]
      );
    }
    await conn.commit();
    await cacheDel('dashboard:*');
    await logActivity({ userId: req.user.id, action: 'order.create', entity: 'order', entityId: r.insertId, ip: req.ip });
    res.status(201).json({ id: r.insertId, order_no: orderNo });
  } catch (e) {
    await conn.rollback(); throw e;
  } finally { conn.release(); }
};

exports.updateStatus = async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.query('SELECT * FROM orders WHERE id=? FOR UPDATE', [id]);
    const order = rows[0];
    if (!order) throw new ApiError(404, 'Order not found');
    if (order.status === status) { await conn.commit(); return res.json({ updated: true }); }

    // Apply stock change once when moving to 'completed'
    if (status === 'completed' && order.status !== 'completed') {
      const [items] = await conn.query('SELECT * FROM order_items WHERE order_id=?', [id]);
      for (const it of items) {
        const delta = order.type === 'purchase' ? it.quantity : -it.quantity;
        const [pr] = await conn.query('SELECT stock_qty FROM products WHERE id=? FOR UPDATE', [it.product_id]);
        const newQty = (pr[0]?.stock_qty || 0) + delta;
        if (newQty < 0) throw new ApiError(400, `Insufficient stock for product ${it.product_id}`);
        await conn.query('UPDATE products SET stock_qty=? WHERE id=?', [newQty, it.product_id]);
        await conn.query(
          'INSERT INTO stock_adjustments (product_id,user_id,change_qty,reason) VALUES (?,?,?,?)',
          [it.product_id, req.user.id, delta, `Order ${order.order_no}`]
        );
      }
    }
    await conn.query('UPDATE orders SET status=? WHERE id=?', [status, id]);
    await conn.commit();
    await cacheDel('products:*'); await cacheDel('dashboard:*');
    await logActivity({ userId: req.user.id, action: 'order.status', entity: 'order', entityId: id, meta: { status }, ip: req.ip });
    res.json({ updated: true });
  } catch (e) {
    await conn.rollback(); throw e;
  } finally { conn.release(); }
};
