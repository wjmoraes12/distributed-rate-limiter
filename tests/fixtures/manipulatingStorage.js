import Bucket from "../../src/entities/Bucket.js";

export function createBucketByKey(key, storage) {
    const bucket = Bucket.create(5, 1000);
    storage.set(key, bucket);
    return bucket;
}

export function consumingBucket(bucket, key, storage) {
    bucket.consume();
    storage.set(key, bucket);
    return bucket;
}