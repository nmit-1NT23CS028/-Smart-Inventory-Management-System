require('dotenv').config();
const app = require('./app');
const logger = require('./utils/logger');
const { pool } = require('./config/db');
const { connectRedis } = require('./config/redis');

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await pool.query('SELECT 1');
    logger.info('MySQL connected');
    await connectRedis();
    app.listen(PORT, () => logger.info(`API ready on :${PORT}`));
  } catch (err) {
    logger.error('Startup failure', err);
    process.exit(1);
  }
})();
