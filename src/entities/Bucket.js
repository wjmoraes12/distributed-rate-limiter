class Bucket {

    constructor(tokens, updatedAt) {

        if(tokens < 0){
            throw new Error("Invalid Tokens")
        }

        if(!updatedAt){
            throw new Error("Invalid timestamp");
        }

        this.tokens = tokens;
        this.updatedAt = updatedAt;
    }

    static create(capacity, now = Date.now()) {
        return new Bucket(capacity, now);
    }

    refill(capacity, refillAmount, refillTimeMs, now) {

        const timePassed = now - this.updatedAt;

        const tokensToAdd = Math.floor(timePassed / refillTimeMs) * refillAmount;

        if (tokensToAdd > 0) {

            this.tokens = Math.min(capacity, this.tokens + tokensToAdd);
            this.updatedAt = now;
        }

        return timePassed;
    }

    canConsume() {
        return this.tokens > 0;
    }

    consume() {

        if(!this.canConsume()){
            throw new Error("No tokens available");
        }
    
        this.tokens--;
    }

    reset(capacity, now = Date.now()) {
        this.tokens = capacity;
        this.updatedAt = now;
    }

    retryAfter(refillTimeMs, timePassed){
        const retryAfter = refillTimeMs - (timePassed % refillTimeMs);

        return {
            allowed: false,
            retryAfter: Math.ceil(retryAfter / 1000)
        };
    }
}

export default Bucket;