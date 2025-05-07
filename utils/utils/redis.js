const logger = require('./logger');

let client;

if (process.env.REDIS_ENABLED === 'true') {
  try {
    const redis = require('redis');
    
    // Create Redis client
    client = redis.createClient({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: process.env.REDIS_PORT || 6379,
      retry_strategy: (options) => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          logger.error('Redis server connection refused');
          return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
          return undefined;
        }
        return Math.min(options.attempt * 100, 5000);
      }
    });

    // Error handling
    client.on('error', (err) => {
      logger.error(`Redis error: ${err}`);
    });

    client.on('connect', () => {
      logger.info('Connected to Redis');
    });

    client.on('ready', () => {
      logger.info('Redis is ready');
    });

    client.on('reconnecting', () => {
      logger.info('Reconnecting to Redis...');
    });
  } catch (err) {
    logger.error(`Redis module not found: ${err.message}`);
    // Fallback to mock client
    client = createMockRedisClient();
  }
} else {
  logger.info('Redis disabled in configuration');
  // Create a mock Redis client
  client = createMockRedisClient();
}

function createMockRedisClient() {
  return {
    get: async () => null,
    set: async () => true,
    setex: async () => true,
    on: () => {},
    quit: () => Promise.resolve()
  };
}

module.exports = client;