import TokenBucketAlgorithm from "../algorithms/token-bucket-algorithm.js";
import memoryStore from "../storage/memory-store.js";

class RateLimiterService {

    constructor(){

        this.algorithm = new TokenBucketAlgorithm(memoryStore);

    }

    consume(key){

        return this.algorithm.consume(key);

    }

    getAll(){

        return this.algorithm.getAll();

    }

}

export default new RateLimiterService();