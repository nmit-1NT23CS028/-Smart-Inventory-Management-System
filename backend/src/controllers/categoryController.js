const { pool } = require('../config/db');
const ApiError = require('../utils/ApiError');

exports.list = async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM categories ORDER BY name');
  res.json(rows);
};
exports.create = async (req, res) => {
  try {
    const [r] = await pool.query('INSERT INTO categories (name,description) VALUES (?,?)',
      [req.body.name, req.body.description || null]);
    res.status(201).json({ id: r.insertId });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') throw new ApiError(409, 'Category exists');
    throw e;
  }
};
exports.update = async (req, res) => {
  await pool.query('UPDATE categories SET name=?,description=? WHERE id=?',
    [req.body.name, req.body.description || null, req.params.id]);
  res.json({ updated: true });
};
exports.remove = async (req, res) => {
  await pool.query('DELETE FROM categories WHERE id=?', [req.params.id]);
  res.json({ deleted: true });
};
