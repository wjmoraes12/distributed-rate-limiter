import BucketNotFoundException from "../exceptions/bucket-not-found-exception.js";
import RateLimitExceededException from "../exceptions/rate-limit-exceeded-exception.js";


class RateLimiterService {

    constructor(algorithm){
        this.algorithm = algorithm;
    }

    async consume(key) {
        const result = await this.algorithm.consume(key);
    
        if (!result.allowed) {
            throw new RateLimitExceededException(result.retryAfter);
        }
    
        return result;
    }
    
    async getAll() {
        return await this.algorithm.getAll();
    }
    
    async getBucketByKey(key) {
        const bucket = await this.algorithm.getBucketByKey(key);
    
        if (bucket === null) {
            throw new BucketNotFoundException(key);
        }
    
        return bucket;
    }
    
    async resetBucket(key) {
        const bucket = await this.algorithm.resetBucket(key);

        if (bucket === null) {
            throw new BucketNotFoundException(key);
        }
    
        return bucket;
    }
    
    async deleteBucketByKey(key) {
        const deleted = await this.algorithm.deleteBucketByKey(key);
        if (deleted === false) {
            throw new BucketNotFoundException(key);
        }
    
        return { deleted: true };
    }
    
    async deleteAll() {
        return await this.algorithm.deleteAll();    
    }

}

export default RateLimiterService;