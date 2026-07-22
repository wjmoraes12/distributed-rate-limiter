class RateLimitExceededException extends Error {

    constructor(retryAfter) {
        super("Rate limit exceeded");

        this.name = "RateLimitExceededException";
        this.retryAfter = retryAfter;
    }

}
export default RateLimitExceededException;