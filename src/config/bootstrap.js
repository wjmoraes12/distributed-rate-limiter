import MemoryStore from "../storage/memory-store.js";
import TokenBucketAlgorithm from "../algorithms/token-bucket-algorithm.js";
import RateLimiterService from "../services/rateLimiter-service.js";
import LimitController from "../controllers/limit-controller.js";
import rateLimiterConfig from "./rate-limiter-config.js";
import Logger from "../logger/logger.js";
import createLoggerMiddleware from "../middlewares/logger-middleware.js";
import createErrorMiddleware from "../middlewares/error-middleware.js";
import MemoryBucketRepository from "../repositories/memory-bucket-repository.js";
import SystemClock from "../clock/system-clock.js";

const logger = new Logger();
const loggerMiddleware = createLoggerMiddleware(logger);
const errorMiddleware = createErrorMiddleware(logger);

const store = new MemoryStore();

const bucketRepository = new MemoryBucketRepository(store)
const clock = new SystemClock()

const algorithm = new TokenBucketAlgorithm(clock, bucketRepository,rateLimiterConfig);

const service = new RateLimiterService(algorithm);

const controller = new LimitController(service);

export {
    controller,
    loggerMiddleware,
    errorMiddleware
};