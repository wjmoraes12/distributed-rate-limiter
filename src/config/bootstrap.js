import MemoryStore from "../storage/memory-store.js";
import TokenBucketAlgorithm from "../algorithms/token-bucket-algorithm.js";
import RateLimiterService from "../services/rateLimiter-service.js";
import LimitController from "../controllers/limit-controller.js";

const store = new MemoryStore();

const algorithm = new TokenBucketAlgorithm(store);

const service = new RateLimiterService(algorithm);

const controller = new LimitController(service);

export {
    controller
};