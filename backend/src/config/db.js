const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER || 'sims',
  password: process.env.MYSQL_PASSWORD || 'simspass',
  database: process.env.MYSQL_DATABASE || 'sims',
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0,
});

module.exports = { pool };
