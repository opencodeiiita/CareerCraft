import Redis from "ioredis";

const {
    REDIS_HOST = "localhost",
    REDIS_PORT = 6379,
    REDIS_PASSWORD,
} = process.env;

const redisOptions = {
    host: REDIS_HOST,
    port: Number(REDIS_PORT),
    maxRetriesPerRequest: null,
    retryStrategy: (times) => {
        const targetError = "ECONNREFUSED";
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

redis.on("error", (err) => {
    if (err.code === "ECONNREFUSED") {
        // Suppress repeated ECONNREFUSED logs if we've already decided to give up or are retrying
        if (isConnected) {
            console.error("Redis connection lost:", err.message);
            isConnected = false;
        }
    } else {
        console.error("Redis error:", err);
    }
});


export default redis;
