const { createClient } = require('redis');
const logger = require('../utils/logger');

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
  },
});

client.on('error', (err) => logger.error('Redis error', err));

async function connectRedis() {
  if (!client.isOpen) await client.connect();
  logger.info('Redis connected');
}

async function cacheGet(key) {
  try {
    const v = await client.get(key);
    return v ? JSON.parse(v) : null;
  } catch { return null; }
}

async function cacheSet(key, value, ttlSeconds = 60) {
  try { await client.setEx(key, ttlSeconds, JSON.stringify(value)); } catch {}
}

async function cacheDel(pattern) {
  try {
    const keys = await client.keys(pattern);
    if (keys.length) await client.del(keys);
  } catch {}
}

module.exports = { client, connectRedis, cacheGet, cacheSet, cacheDel };
