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

    async consume(key) {
        this.validateKey(key);

        const now = this.clock.now();

        const bucket = await this.getOrCreateBucket(key, now);

        const timePassed = bucket.refill(
            this.capacity,
            this.refillAmount,
            this.refillTimeMs,
            now
        );

        if (!bucket.canConsume()) {
            await this.saveBucket(key, bucket);

            return  bucket.retryAfter(
                this.refillTimeMs,
                timePassed
            );
        }

        bucket.consume();

        await this.saveBucket(key, bucket);

        return this.buildAllowedResponse(bucket);
    }

    async getAll() {
        return await this.bucketRepository.findAll();
    }

    async getBucketByKey(key) {
        this.validateKey(key);

        return await this.loadBucket(key);
    }

    async resetBucket(key) {
        this.validateKey(key);

        const bucket = await this.loadBucket(key);

        if (!bucket) {
            return null;
        }

        bucket.reset(
            this.capacity,
            this.clock.now()
        );

        await this.saveBucket(key, bucket);

        return bucket;
    }

    async deleteBucketByKey(key) {
        this.validateKey(key);

        const bucket = await this.loadBucket(key);

        if (!bucket) {
            return false;
        }

        return await this.bucketRepository.remove(key);
    }

    async deleteAll() {
        return await this.bucketRepository.removeAll();
    }

    async getOrCreateBucket(key, now) {
        const bucket = await this.loadBucket(key);

        if (bucket) {
            return bucket;
        }

        return Bucket.create(
            this.capacity,
            now
        );
    }

    async loadBucket(key) {
        return await this.bucketRepository.findByKey(key);
    }

    async saveBucket(key, bucket) {
        await this.bucketRepository.save(
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