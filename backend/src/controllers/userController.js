const bcrypt = require('bcrypt');
const { pool } = require('../config/db');
const ApiError = require('../utils/ApiError');
const { logActivity } = require('../services/activity');

exports.list = async (_req, res) => {
  const [rows] = await pool.query('SELECT id,name,email,role,is_active,created_at FROM users ORDER BY id DESC');
  res.json(rows);
};

exports.create = async (req, res) => {
  const { name, email, password, role } = req.body;
  const hash = await bcrypt.hash(password, Number(process.env.BCRYPT_ROUNDS) || 10);
  try {
    const [r] = await pool.query(
      'INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,?)',
      [name, email, hash, role]
    );
    await logActivity({ userId: req.user.id, action: 'user.create', entity: 'user', entityId: r.insertId, ip: req.ip });
    res.status(201).json({ id: r.insertId });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') throw new ApiError(409, 'Email already exists');
    throw e;
  }
};

exports.update = async (req, res) => {
  const id = Number(req.params.id);
  const fields = [];
  const values = [];
  for (const k of ['name','role','is_active']) {
    if (req.body[k] !== undefined) { fields.push(`${k}=?`); values.push(req.body[k]); }
  }
  if (req.body.password) {
    const hash = await bcrypt.hash(req.body.password, Number(process.env.BCRYPT_ROUNDS) || 10);
    fields.push('password_hash=?'); values.push(hash);
  }
  if (!fields.length) throw new ApiError(400, 'No fields to update');
  values.push(id);
  await pool.query(`UPDATE users SET ${fields.join(',')} WHERE id=?`, values);
  await logActivity({ userId: req.user.id, action: 'user.update', entity: 'user', entityId: id, ip: req.ip });
  res.json({ updated: true });
};

exports.remove = async (req, res) => {
  const id = Number(req.params.id);
  await pool.query('DELETE FROM users WHERE id=?', [id]);
  await logActivity({ userId: req.user.id, action: 'user.delete', entity: 'user', entityId: id, ip: req.ip });
  res.json({ deleted: true });
};

exports.activity = async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT al.*, u.name AS user_name FROM activity_logs al
     LEFT JOIN users u ON u.id = al.user_id
     ORDER BY al.created_at DESC LIMIT 200`
  );
  res.json(rows);
};
