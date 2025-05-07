const redis = require('redis');
const { promisify } = require('util');
const logger = require('../utils/logger'); 

// Redis client setup
let redisClient;
let getAsync;
let setAsync;

if (process.env.REDIS_URL) {
  redisClient = redis.createClient({
    url: process.env.REDIS_URL,
    socket: {
      reconnectStrategy: (retries) => Math.min(retries * 100, 5000)
    }
  });

  redisClient.on('error', (err) => {
    logger.error('Redis error:', err);
  });

  redisClient.on('connect', () => {
    logger.info('Redis connected successfully');
  });

  getAsync = promisify(redisClient.get).bind(redisClient);
  setAsync = promisify(redisClient.set).bind(redisClient);
}

/**
 * Store data in cache
 * @param {string} key - Cache key
 * @param {*} data - Data to cache
 * @param {number} duration - Cache duration in seconds
 */
const cacheData = async (key, data, duration = 3600) => {
  if (!redisClient || !redisClient.connected) {
    return false;
  }

  try {
    await setAsync(key, JSON.stringify(data), 'EX', duration);
    return true;
  } catch (err) {
    logger.error('Cache set error:', err);
    return false;
  }
};

/**
 * Retrieve data from cache
 * @param {string} key - Cache key
 * @returns {Promise<*>} Cached data or null
 */
const getCachedData = async (key) => {
  if (!redisClient || !redisClient.connected) {
    return null;
  }

  try {
    const data = await getAsync(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    logger.error('Cache get error:', err);
    return null;
  }
};

/**
 * Clear cache for a specific key
 * @param {string} key - Cache key to clear
 */
const clearCache = async (key) => {
  if (!redisClient || !redisClient.connected) {
    return false;
  }

  try {
    await redisClient.del(key);
    return true;
  } catch (err) {
    logger.error('Cache clear error:', err);
    return false;
  }
};

module.exports = {
  cacheData,
  getCachedData,
  clearCache,
  redisClient
};