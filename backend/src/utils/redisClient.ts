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
};
if (REDIS_PASSWORD) redisOptions.password = REDIS_PASSWORD;

const redis = new Redis(redisOptions);

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

export default redis;
