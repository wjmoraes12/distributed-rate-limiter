class RateLimiter {

    constructor(algorithm){
        this.algorithm = algorithm;

    }

    consume(key){
        return this.algorithm.consume(key);

    }

}