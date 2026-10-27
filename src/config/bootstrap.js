import MemoryStore from "../storage/memory-store.js";
import RedisStore from "../storage/redis-store.js";
import TokenBucketAlgorithm from "../algorithms/token-bucket-algorithm.js";
import RateLimiterService from "../services/rateLimiter-service.js";
import LimitController from "../controllers/limit-controller.js";
import rateLimiterConfig from "./rate-limiter-config.js";
import Logger from "../logger/logger.js";
import createLoggerMiddleware from "../middlewares/logger-middleware.js";
import createErrorMiddleware from "../middlewares/error-middleware.js";
import MemoryBucketRepository from "../repositories/memory-bucket-repository.js";
import RedisBucketRepository from "../repositories/redis-bucket-repository.js";
import SystemClock from "../clock/system-clock.js";
import validateCheckRequest from "../middlewares/validate-check-request.js";


const logger = new Logger();
const loggerMiddleware = createLoggerMiddleware(logger);
const errorMiddleware = createErrorMiddleware(logger);
const validateCheckRequestMiddleware = validateCheckRequest(logger);

async function createBucketRepository() {
    const driver = process.env.STORAGE_DRIVER ?? "redis";

    if (driver === "memory") {
        const store = new MemoryStore();
        return new MemoryBucketRepository(store);
    }

    if (driver === "redis") {
        const store = new RedisStore({ url: process.env.REDIS_URL, prefix:"rate-limiter:bucket:" });
        await store.connect();
        return new RedisBucketRepository(store);
    }

    throw new Error(`STORAGE_DRIVER inválido: "${driver}" (use "redis" ou "memory")`);
}

const bucketRepository = await createBucketRepository();
const clock = new SystemClock()

const algorithm = new TokenBucketAlgorithm(clock, bucketRepository,rateLimiterConfig);

const service = new RateLimiterService(algorithm);

const controller = new LimitController(service);

export {
    controller,
    loggerMiddleware,
    errorMiddleware,
    validateCheckRequestMiddleware
};