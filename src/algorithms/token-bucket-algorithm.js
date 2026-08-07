import Algorithm from "../interfaces/RateLimiterAlgoritm.js";
import Bucket from "../entities/Bucket.js";

class TokenBucketAlgorithm extends Algorithm {

    constructor(clock, bucketRepository, options = {}) {
        super();

        this.clock = clock;
        this.bucketRepository = bucketRepository;

        this.capacity = options.capacity;
        this.refillAmount = options.refillAmount;
        this.refillTimeMs = options.refillTimeMs;
    }

    consume(key) {

        this.validateKey(key);

        const now = this.clock.now();

        const bucket = this.getOrCreateBucket(key, now);

        const timePassed = bucket.refill(
            this.capacity,
            this.refillAmount,
            this.refillTimeMs,
            now
        );

        if (!bucket.canConsume()) {

            this.saveBucket(key, bucket);

            return bucket.retryAfter(
                this.refillTimeMs,
                timePassed
            );
        }

        bucket.consume();

        this.saveBucket(key, bucket);

        return this.buildAllowedResponse(bucket);
    }

    getAll() {
        return this.bucketRepository.findAll();
    }

    getBucketByKey(key) {

        this.validateKey(key);

        return this.loadBucket(key);
    }

    resetBucket(key) {
        
        this.validateKey(key);
        const bucket = this.loadBucket(key);

        if (!bucket) {
            return null;
        }

        bucket.reset(
            this.capacity,
            this.clock.now()
        );

        this.saveBucket(key, bucket);

        return bucket;
    }

    deleteBucketByKey(key) {

        this.validateKey(key);

        return this.bucketRepository.remove(key);
    }

    deleteAll() {
        return this.bucketRepository.removeAll();
    }

    // Helpers
    getOrCreateBucket(key, now) {

        const bucket = this.loadBucket(key);

        if (bucket) {
            return bucket;
        }

        return Bucket.create(
            this.capacity,
            now
        );
    }

    loadBucket(key) {
        return this.bucketRepository.findByKey(key);
    }

    saveBucket(key, bucket) {
        this.bucketRepository.save(
            key,
            bucket
        );
    }

    buildAllowedResponse(bucket) {
        return {
            allowed: true,
            tokens: bucket.tokens,
            retryAfter: 0
        };
    }

    validateKey(key) {
        if (typeof key !== "string") {
            throw new Error("Invalid key");
        }

        if (key.trim() === "") {
            throw new Error("Invalid key");
        }
    }

}

export default TokenBucketAlgorithm;