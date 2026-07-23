import Algorithm from "./algorithm.js";
import Bucket from "../entities/Bucket.js";

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

        const timePassed = bucket.refill(
            this.capacity,
            this.refillAmount,
            this.refillTimeMs,
            now
        );

        if (!bucket.canConsume()) {
            this.saveBucket(key, bucket);
            return bucket.retryAfter(this.refillTimeMs, timePassed)        
        }

        bucket.consume();

        this.saveBucket(key,bucket);

        return this.buildAllowedResponse(bucket);
    }

    getAll() {
        return this.store.getAll();
    }

    getBucketByKey(key){
        return this.store.get(key);
    }

    resetBucket(key){
        const now = Date.now();

        const bucket = this.store.get(key);

        if (!bucket) {
            return null;
        }

        bucket.reset(this.capacity, now);

        this.saveBucket(key, bucket);

        return bucket;
    }

    deleteAll(){
        return this.store.deleteAll()
    }

    deleteBucketByKey(key){
        return this.store.delete(key)
    }

    //Métodos Auxiliares
    getOrCreateBucket(key, now) {
        const bucket = this.store.get(key);
        if (bucket) {
            return bucket;
        }

        return Bucket.create(this.capacity, now);
    }

    saveBucket(key, bucket) {
        this.store.set(key, bucket);
    }

    buildAllowedResponse(bucket) {
        return {
            allowed: true,
            tokens: bucket.tokens,
        };
    }
}
export default TokenBucketAlgorithm;