import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redis from "../utils/redisClient.js";

// Helper function to create a rate limiter
const createLimiter = (options) => {
    return rateLimit({
        windowMs: options.windowMs,
        max: options.max,
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        // store: new RedisStore({
        //     sendCommand: (...args) => redis.call(...args),
        // }),
        message: {
            success: false,
            message: options.message || "Too many requests, please try again later.",
        },
        ...options,
    });
};

// 1. Global Limiter: 100 requests per 15 minutes
export const globalLimiter = createLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: "Too many requests from this IP, please try again after 15 minutes.",
});

// 2. Auth Limiter: 10 requests per 15 minutes (Strict)
export const authLimiter = createLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: "Too many login/register attempts, please try again after 15 minutes.",
});

// 3. ML Service Limiter: 20 requests per hour (Moderate)
export const mlServiceLimiter = createLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20,
    message: "Daily limit for AI generation reached. Please try again later.",
});
