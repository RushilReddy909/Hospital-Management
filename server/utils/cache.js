import redis from "redis";

let redisClient = null;

// Initialize Redis client
export const initRedis = async () => {
  try {
    redisClient = redis.createClient({
      host: process.env.REDIS_HOST || "localhost",
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 500),
      },
    });

    redisClient.on("error", (err) => {
      console.error("Redis Client Error:", err);
    });

    redisClient.on("connect", () => {
      console.log("Redis Connected Successfully");
    });

    await redisClient.connect();
    return redisClient;
  } catch (err) {
    console.error("Failed to initialize Redis:", err);
    redisClient = null;
  }
};

// Get Redis client instance
export const getRedis = () => redisClient;

// Cache operations
export const cache = {
  // Set cache with TTL
  async set(key, value, ttl = 300) {
    try {
      if (!redisClient) return null;
      const serialized = JSON.stringify(value);
      if (ttl) {
        await redisClient.setEx(key, ttl, serialized);
      } else {
        await redisClient.set(key, serialized);
      }
      return true;
    } catch (err) {
      console.error(`Cache SET error for ${key}:`, err);
      return null;
    }
  },

  // Get cache value
  async get(key) {
    try {
      if (!redisClient) return null;
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error(`Cache GET error for ${key}:`, err);
      return null;
    }
  },

  // Delete cache key
  async del(key) {
    try {
      if (!redisClient) return null;
      return await redisClient.del(key);
    } catch (err) {
      console.error(`Cache DEL error for ${key}:`, err);
      return null;
    }
  },

  // Delete multiple keys by pattern
  async delPattern(pattern) {
    try {
      if (!redisClient) return 0;
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        return await redisClient.del(keys);
      }
      return 0;
    } catch (err) {
      console.error(`Cache DELPATTERN error for ${pattern}:`, err);
      return 0;
    }
  },
};
