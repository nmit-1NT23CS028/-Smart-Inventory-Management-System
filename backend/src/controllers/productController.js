const { pool } = require('../config/db');
const { cacheGet, cacheSet, cacheDel } = require('../config/redis');
const ApiError = require('../utils/ApiError');
const { logActivity } = require('../services/activity');

const CACHE_KEY = 'products:all';

exports.list = async (_req, res) => {
  const cached = await cacheGet(CACHE_KEY);
  if (cached) return res.json({ cached: true, data: cached });
  const [rows] = await pool.query(
    `SELECT p.*, c.name AS category_name, s.name AS supplier_name
     FROM products p
     LEFT JOIN categories c ON c.id = p.category_id
     LEFT JOIN suppliers s ON s.id = p.supplier_id
     ORDER BY p.id DESC`
  );
  await cacheSet(CACHE_KEY, rows, 60);
  res.json({ cached: false, data: rows });
};

exports.get = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM products WHERE id=?', [req.params.id]);
  if (!rows[0]) throw new ApiError(404, 'Product not found');
  res.json(rows[0]);
};

exports.create = async (req, res) => {
  const p = req.body;
  try {
    const [r] = await pool.query(
      `INSERT INTO products (sku,barcode,name,description,category_id,supplier_id,cost_price,sell_price,stock_qty,reorder_level)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [p.sku,p.barcode||null,p.name,p.description||null,p.category_id||null,p.supplier_id||null,p.cost_price,p.sell_price,p.stock_qty,p.reorder_level]
    );
    await cacheDel('products:*');
    await cacheDel('dashboard:*');
    await logActivity({ userId: req.user.id, action: 'product.create', entity: 'product', entityId: r.insertId, ip: req.ip });
    res.status(201).json({ id: r.insertId });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') throw new ApiError(409, 'SKU or barcode already exists');
    throw e;
  }
};

exports.update = async (req, res) => {
  const id = Number(req.params.id);
  const p = req.body;
  await pool.query(
    `UPDATE products SET sku=?,barcode=?,name=?,description=?,category_id=?,supplier_id=?,
     cost_price=?,sell_price=?,stock_qty=?,reorder_level=? WHERE id=?`,
    [p.sku,p.barcode||null,p.name,p.description||null,p.category_id||null,p.supplier_id||null,
     p.cost_price,p.sell_price,p.stock_qty,p.reorder_level,id]
  );
  await cacheDel('products:*'); await cacheDel('dashboard:*');
  await logActivity({ userId: req.user.id, action: 'product.update', entity: 'product', entityId: id, ip: req.ip });
  res.json({ updated: true });
};

exports.remove = async (req, res) => {
  const id = Number(req.params.id);
  await pool.query('DELETE FROM products WHERE id=?', [id]);
  await cacheDel('products:*'); await cacheDel('dashboard:*');
  await logActivity({ userId: req.user.id, action: 'product.delete', entity: 'product', entityId: id, ip: req.ip });
  res.json({ deleted: true });
};

exports.adjustStock = async (req, res) => {
  const id = Number(req.params.id);
  const { change_qty, reason } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.query('SELECT stock_qty FROM products WHERE id=? FOR UPDATE', [id]);
    if (!rows[0]) throw new ApiError(404, 'Product not found');
    const newQty = rows[0].stock_qty + change_qty;
    if (newQty < 0) throw new ApiError(400, 'Insufficient stock');
    await conn.query('UPDATE products SET stock_qty=? WHERE id=?', [newQty, id]);
    await conn.query(
      'INSERT INTO stock_adjustments (product_id,user_id,change_qty,reason) VALUES (?,?,?,?)',
      [id, req.user.id, change_qty, reason || null]
    );
    await conn.commit();
    await cacheDel('products:*'); await cacheDel('dashboard:*');
    await logActivity({ userId: req.user.id, action: 'stock.adjust', entity: 'product', entityId: id, meta: { change_qty, reason }, ip: req.ip });
    res.json({ updated: true, stock_qty: newQty });
  } catch (e) {
    await conn.rollback(); throw e;
  } finally { conn.release(); }
};

exports.adjustments = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT sa.*, u.name AS user_name FROM stock_adjustments sa
     LEFT JOIN users u ON u.id = sa.user_id
     WHERE sa.product_id=? ORDER BY sa.created_at DESC`, [req.params.id]
  );
  res.json(rows);
};
