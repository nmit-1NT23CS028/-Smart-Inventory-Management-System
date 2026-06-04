const { pool } = require('../config/db');
exports.list = async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM suppliers ORDER BY name');
  res.json(rows);
};
exports.create = async (req, res) => {
  const { name, email, phone, address } = req.body;
  const [r] = await pool.query('INSERT INTO suppliers (name,email,phone,address) VALUES (?,?,?,?)',
    [name, email || null, phone || null, address || null]);
  res.status(201).json({ id: r.insertId });
};
exports.update = async (req, res) => {
  const { name, email, phone, address } = req.body;
  await pool.query('UPDATE suppliers SET name=?,email=?,phone=?,address=? WHERE id=?',
    [name, email || null, phone || null, address || null, req.params.id]);
  res.json({ updated: true });
};
exports.remove = async (req, res) => {
  await pool.query('DELETE FROM suppliers WHERE id=?', [req.params.id]);
  res.json({ deleted: true });
};
