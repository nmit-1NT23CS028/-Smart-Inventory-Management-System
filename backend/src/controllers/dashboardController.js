const { pool } = require('../config/db');
const { cacheGet, cacheSet } = require('../config/redis');

exports.overview = async (_req, res) => {
  const KEY = 'dashboard:overview';
  const cached = await cacheGet(KEY);
  if (cached) return res.json({ cached: true, data: cached });

  const [[counts]] = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM products WHERE is_active=1) AS total_products,
      (SELECT COALESCE(SUM(stock_qty),0) FROM products) AS total_stock,
      (SELECT COUNT(*) FROM products WHERE stock_qty <= reorder_level) AS low_stock,
      (SELECT COUNT(*) FROM orders) AS total_orders,
      (SELECT COUNT(*) FROM users WHERE is_active=1) AS total_users
  `);

  const [lowStock] = await pool.query(
    `SELECT id,sku,name,stock_qty,reorder_level FROM products
     WHERE stock_qty <= reorder_level ORDER BY stock_qty ASC LIMIT 10`
  );

  const [recentOrders] = await pool.query(
    `SELECT id,order_no,type,status,total_amount,created_at FROM orders
     ORDER BY created_at DESC LIMIT 10`
  );

  const [salesByDay] = await pool.query(`
    SELECT DATE(created_at) AS day, SUM(total_amount) AS total
    FROM orders WHERE type='sales' AND status='completed'
      AND created_at >= DATE_SUB(CURDATE(), INTERVAL 14 DAY)
    GROUP BY DATE(created_at) ORDER BY day
  `);

  const [topProducts] = await pool.query(`
    SELECT p.id, p.name, SUM(oi.quantity) AS sold
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    JOIN products p ON p.id = oi.product_id
    WHERE o.type='sales' AND o.status='completed'
    GROUP BY p.id ORDER BY sold DESC LIMIT 5
  `);

  const data = { counts, lowStock, recentOrders, salesByDay, topProducts };
  await cacheSet(KEY, data, 30);
  res.json({ cached: false, data });
};
