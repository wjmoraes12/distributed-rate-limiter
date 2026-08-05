import Bucket from "../../src/entities/Bucket.js";

export default class BucketBuilder {

    constructor() {

        this.capacity = 5;
        this.tokens = 5;
        this.updatedAt = 0;

    }

    withTokens(tokens) {

        this.tokens = tokens;

        return this;
    }

    withUpdatedAt(time) {

        this.updatedAt = time;

        return this;
    }

    build() {

        const bucket = Bucket.create(
            this.capacity,
            this.updatedAt
        );

        bucket.tokens = this.tokens;

        return bucket;

    }

}