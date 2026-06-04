const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const ApiError = require('../utils/ApiError');
const { logActivity } = require('../services/activity');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await pool.query('SELECT * FROM users WHERE email=? AND is_active=1', [email]);
  const user = rows[0];
  if (!user) throw new ApiError(401, 'Invalid credentials');
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) throw new ApiError(401, 'Invalid credentials');

  const token = jwt.sign(
    { id: user.id, role: user.role, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
  await logActivity({ userId: user.id, action: 'login', ip: req.ip });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
};

exports.me = async (req, res) => {
  const [rows] = await pool.query('SELECT id,name,email,role,is_active,created_at FROM users WHERE id=?', [req.user.id]);
  res.json(rows[0] || null);
};
