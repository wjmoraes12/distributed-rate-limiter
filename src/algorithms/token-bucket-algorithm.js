import Algorithm from "./algorithm.js";

class TokenBucketAlgorithm extends Algorithm {

    constructor(store, options = {}) {
        super();

        this.store = store;

        this.capacity = options.capacity ?? 5;
        this.refillAmount = options.refillAmount ?? 1;
        this.refillTimeMs = options.refillTimeMs ?? 100000;
    }

    consume(key) {
        const now = Date.now();

        const bucket = this.getOrCreateBucket(key, now);

        const { timePassed } = this.refillBucket(bucket, now);

        if (!this.canConsume(bucket)) {
            this.saveBucket(key, bucket);
            return this.buildDeniedResponse(bucket, timePassed);
        }

        this.consumeToken(bucket);

        this.saveBucket(key, bucket);

        return this.buildAllowedResponse(bucket);
    }

    getOrCreateBucket(key, now) {
        const bucket = this.store.get(key);

        if (bucket) {
            return bucket;
        }

        return {
            tokens: this.capacity,
            updatedAt: now
        };
    }

    refillBucket(bucket, now) {
        const timePassed = now - bucket.updatedAt;

        const tokensToAdd = Math.floor(timePassed / this.refillTimeMs) * this.refillAmount;

        if (tokensToAdd > 0) {
            bucket.tokens = Math.min(
                this.capacity,
                bucket.tokens + tokensToAdd
            );

            bucket.updatedAt = now;
        }

        return {
            timePassed
        };
    }

    canConsume(bucket) {
        return bucket.tokens > 0;
    }

    consumeToken(bucket) {
        bucket.tokens--;
    }

    saveBucket(key, bucket) {
        this.store.set(key, bucket);
    }

    buildAllowedResponse(bucket) {
        return {
            allowed: true,
            tokens: bucket.tokens,
            retryAfter: 0
        };
    }

    buildDeniedResponse(bucket, timePassed) {
        const retryAfter = this.refillTimeMs - (timePassed % this.refillTimeMs);

        return {
            allowed: false,
            tokens: bucket.tokens,
            retryAfter: Math.ceil(retryAfter / 1000)
        };
    }

    getAll(){
        return this.store.getAll();
    }
}

export default TokenBucketAlgorithm;