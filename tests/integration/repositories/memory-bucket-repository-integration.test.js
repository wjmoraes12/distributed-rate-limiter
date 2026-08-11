import { describe, it, expect } from "vitest";
import makeMemoryBucketRepository from "../../fixtures/make-memoryBucketRepository.js"
import Bucket from "../../../src/entities/Bucket.js";
import saveBucket from "../../helpers/saveBucket-helper.js";

describe("MemoryBucketRepository + MemoryStore", () => {

    describe("save()", () => {

        it("should persist and retrieve a bucket through the storage", () => {

            const repository = new makeMemoryBucketRepository();

            const bucket = Bucket.create(5, 1000);
            const key = "127.0.0.1";

            repository.save(key, bucket);

            const result = repository.findByKey(key);

            expect(result).toBe(bucket);
            expect(result.tokens).toBe(5);
            expect(result.updatedAt).toBe(1000);

        });

        it("should persist and consume one token per each request", () => {

            const repository = new makeMemoryBucketRepository();

            const bucket = Bucket.create(5, 1000);
            const key = "127.0.0.1";
            saveBucket(repository, bucket, key)

            const newBucket = bucket.consume()
            saveBucket(repository, bucket, key)

            const result = repository.findByKey(key);
            expect(result).toBe(bucket);
            expect(result.tokens).toBe(4);
            expect(result.updatedAt).toBe(1000);

        });

        it("should persist independent buckets for different keys", () => {

            const repository = makeMemoryBucketRepository();
        
            const bucket = Bucket.create(5, 1000);
            const bucket2 = Bucket.create(5, 1000);
        
            const key = "127.0.0.1";
            const key2 = "127.0.0.2";
        
            saveBucket(repository, bucket, key);
            saveBucket(repository, bucket2, key2);
        
            bucket2.consume();
        
            saveBucket(repository, bucket2, key2);
        
            expect(repository.findByKey(key).tokens).toBe(5);
            expect(repository.findByKey(key2).tokens).toBe(4);
        
        });
    });

    describe("findByKey()", () => {

        it("should persist and return existent bucket", () => {

            const repository = new makeMemoryBucketRepository();

            const bucket = Bucket.create(5, 1000);
            const key = "127.0.0.1";

            repository.save(key, bucket);

            expect(repository.findByKey(key)).toBe(bucket);
            expect(repository.findByKey(key).tokens).toBe(5);
            expect(repository.findByKey(key).updatedAt).toBe(1000);

        });

        it("should return an undefined bucket when using a key that doesnt exist", () => {

            const repository = new makeMemoryBucketRepository();

            const bucket = Bucket.create(5, 1000);
            const key = "127.0.0.1";

            repository.save(key, bucket);

            expect(repository.findByKey("127.0.0.2")).toBeUndefined();
        });
        
    });

    describe("findAll()", () => {

        it("should return an empty repository", () => {
            const repository = new makeMemoryBucketRepository();
            expect(repository.findAll()).toEqual([]);

        });

        it("should return all of buckets in the repository ", () => {

            const repository = new makeMemoryBucketRepository();

            const bucket = Bucket.create(5, 1000);
            const bucket2 = Bucket.create(5, 1000);
        
            const key = "127.0.0.1";
            const key2 = "127.0.0.2";
        
            saveBucket(repository, bucket, key);
            saveBucket(repository, bucket2, key2);

            expect(repository.findAll()).toHaveLength(2);
        });
        
    });

    describe("remove()", () => {

        it("should remove a bucket using the correct key", () => {
            const repository = new makeMemoryBucketRepository();

            const bucket = Bucket.create(5, 1000);
            const bucket2 = Bucket.create(5, 1000);
        
            const key = "127.0.0.1";
            const key2 = "127.0.0.2";

            saveBucket(repository, bucket, key);
            saveBucket(repository, bucket2, key2);

            expect(repository.remove(key).deleted).toBe(true)
            expect(repository.remove(key).key).toBe(key)
            expect(repository.findAll()).toHaveLength(1)

        });

        it("should return 'bucket not found' when tried to remove a bucket with the wrong key ", () => {
            const repository = new makeMemoryBucketRepository();

            const bucket = Bucket.create(5, 1000);
            const key = "127.0.0.1";
            saveBucket(repository, bucket, key);

            expect(repository.remove("127.0.0.2").deleted).toBe(false)
            expect(repository.remove("127.0.0.2").key).toBe("127.0.0.2")
            expect(repository.findByKey(key).tokens).toBe(5);
        });
        
    });

});