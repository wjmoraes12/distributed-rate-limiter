import memoryStore from "../storage/memory-store.js";

class RateLimiterService {
    constructor() {
        this.capacity = 5; 
        this.refillAmount = 1; 
        this.refillTimeMs = 100 * 1000;
    }

    async consume(key) {
        const now = Date.now();

        let bucket = memoryStore.get(key);
        console.log(bucket);
        if (!bucket) {
            bucket = {
                tokens: this.capacity,
                updatedAt: now
            };
        }

        const timePassed = now - bucket.updatedAt;

        const tokensToAdd = Math.floor(timePassed / this.refillTimeMs) * this.refillAmount;

        if (tokensToAdd > 0) {
            bucket.tokens = Math.min(this.capacity, bucket.tokens + tokensToAdd);
            bucket.updatedAt = now;
        }

        if (bucket.tokens <= 0) {
            const retryAfter = this.refillTimeMs - (timePassed % this.refillTimeMs);

            memoryStore.set(key, bucket);

            return {
                allowed: false,
                tokens: bucket.tokens,
                retryAfter: Math.ceil(retryAfter / 1000)
            };
        }

        bucket.tokens--;

        memoryStore.set(key, bucket);

        return {
            allowed: true,
            tokens: bucket.tokens,
            retryAfter: 0
        };
    }

    async getBucket(key) {
        const bucket = memoryStore.get(key);

        if (!bucket) {
            return {
                tokens: this.capacity,
                capacity: this.capacity
            };
        }

        return {
            tokens: bucket.tokens,
            capacity: this.capacity,
            updatedAt: bucket.updatedAt
        };
    }

    async reset(key) {
        memoryStore.delete(key);

        return {
            message: "Bucket resetado com sucesso"
        };
    }

    async resetAll() {
        memoryStore.clear();

        return {
            message: "Todos os buckets foram resetados"
        };
    }
}

export default new RateLimiterService();