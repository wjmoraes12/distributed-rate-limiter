import TokenBucketAlgorithm from "../algorithms/token-bucket-algorithm";

class RateLimiterService {

    constructor(){

        this.algorithm = new TokenBucketAlgorithm(MemoryStore);

    }

    consume(key){

        return this.algorithm.consume(key);

    }

}

export default new RateLimiterService();