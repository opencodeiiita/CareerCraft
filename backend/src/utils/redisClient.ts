// Redis client utility for CareerCraft backend
import Redis from "ioredis";

const {
  REDIS_HOST = "localhost",
  REDIS_PORT = 6379,
  REDIS_PASSWORD,
} = process.env;

const redisOptions: any = {
  host: REDIS_HOST,
  port: Number(REDIS_PORT),
  maxRetriesPerRequest: null,
  retryStrategy: (times: number) => {
    if (times > 3) {
      console.warn(`[Redis] Could not connect after ${times} attempts. Giving up.`);
      return null; // Stop retrying
    }
    return Math.min(times * 50, 2000);
  },
};
if (REDIS_PASSWORD) redisOptions.password = REDIS_PASSWORD;

const redis = new Redis(redisOptions);

let isConnected = false;

redis.on("connect", () => {
  isConnected = true;

});

redis.on("error", (err: any) => {
  if (err.code === "ECONNREFUSED") {
    if (isConnected) {
      console.error("Redis connection lost:", err.message);
      isConnected = false;
    }
  } else {
    console.error("Redis error:", err);
  }
});

export default redis;
