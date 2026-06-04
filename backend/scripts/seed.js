/**
 * Seed helper: hashes default passwords and upserts demo users.
 * Run AFTER the schema has been applied.
 */
require('dotenv').config();
const bcrypt = require('bcrypt');
const { pool } = require('../src/config/db');

async function upsertUser(name, email, password, role) {
  const hash = await bcrypt.hash(password, Number(process.env.BCRYPT_ROUNDS) || 10);
  await pool.query(
    `INSERT INTO users (name,email,password_hash,role)
     VALUES (?,?,?,?)
     ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash), role=VALUES(role), name=VALUES(name)`,
    [name, email, hash, role]
  );
  console.log('upserted', email);
}

(async () => {
  try {
    await upsertUser('Admin User', 'admin@sims.local', 'Admin@123', 'admin');
    await upsertUser('Manager User', 'manager@sims.local', 'Manager@123', 'manager');
    await upsertUser('Staff User', 'staff@sims.local', 'Staff@123', 'staff');
    console.log('Seed complete');
    process.exit(0);
  } catch (e) {
    console.error(e); process.exit(1);
  }
})();
