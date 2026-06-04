const { pool } = require('../config/db');
async function logActivity({ userId, action, entity, entityId, meta, ip }) {
  await pool.query(
    'INSERT INTO activity_logs (user_id,action,entity,entity_id,meta,ip) VALUES (?,?,?,?,?,?)',
    [userId || null, action, entity || null, entityId || null, meta ? JSON.stringify(meta) : null, ip || null]
  );
}
module.exports = { logActivity };
