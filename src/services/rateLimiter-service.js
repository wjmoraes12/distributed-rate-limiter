import BucketNotFoundException from "../exceptions/bucket-not-found-exception.js";
import RateLimitExceededException from "../exceptions/rate-limit-exceeded-exception.js";
import StorageIsEmptyException from "../exceptions/storage-is-empty-exception.js";

class RateLimiterService {

    constructor(algorithm){

        this.algorithm = algorithm;

    }

    consume(key) {
        const result = this.algorithm.consume(key);
    
        if (!result.allowed) {
            throw new RateLimitExceededException(result.retryAfter);
        }
    
        return result;
    }
    
    getAll() {
        return this.algorithm.getAll();
    }
    
    getBucketByKey(key) {
        const bucket = this.algorithm.getBucketByKey(key);
    
        if (!bucket) {
            throw new BucketNotFoundException(key);
        }
    
        return bucket;
    }
    
    resetBucket(key) {
        const bucket = this.algorithm.resetBucket(key);
    
        if (!bucket) {
            throw new BucketNotFoundException(key);
        }
    
        return bucket;
    }
    
    deleteBucketByKey(key) {
        const deleted = this.algorithm.deleteBucketByKey(key);

        if (deleted.deleted === false) {
            throw new BucketNotFoundException(key);
        }
    
        return { deleted: true };
    }
    
    deleteAll() {
        return this.algorithm.deleteAll();    
    }

}

export default RateLimiterService;