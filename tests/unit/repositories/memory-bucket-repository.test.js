import { describe, it, expect } from "vitest";

import makeMemoryBucketRepository from "../../fixtures/make-memoryBucketRepository.js";
import Bucket from "../../../src/entities/Bucket.js";


describe("MemoryBucketRepository", () => {


    describe("save()", () => {

        it("should create and persist a bucket", () => {

            const repository = makeMemoryBucketRepository();

            const key = "127.0.0.1";
            const bucket = Bucket.create(5, 1000);

            repository.save(key, bucket);

            const result = repository.findByKey(key);

            expect(result).toBeDefined();
            expect(result).toBe(bucket);
            expect(result.tokens).toBe(5);
            expect(result.updatedAt).toBe(1000);

        });


        it("should update an existing bucket", () => {

            const repository = makeMemoryBucketRepository();

            const key = "127.0.0.1";

            const originalBucket = Bucket.create(5, 1000);

            repository.save(key, originalBucket);

            const updatedBucket = Bucket.create(2, 2000);

            repository.save(key, updatedBucket);

            const result = repository.findByKey(key);

            expect(result).toBe(updatedBucket);
            expect(result.tokens).toBe(2);
            expect(result.updatedAt).toBe(2000);

        });


        it("should persist different buckets under different keys", () => {

            const repository = makeMemoryBucketRepository();

            const bucket1 = Bucket.create(5, 1000);
            const bucket2 = Bucket.create(5, 2000);

            repository.save("127.0.0.1", bucket1);
            repository.save("127.0.0.2", bucket2);

            const result1 = repository.findByKey("127.0.0.1");
            const result2 = repository.findByKey("127.0.0.2");

            expect(result1).toBe(bucket1);
            expect(result2).toBe(bucket2);

            expect(result1).not.toBe(result2);

        });


        it("should overwrite the bucket associated with the same key", () => {

            const repository = makeMemoryBucketRepository();

            const key = "127.0.0.1";

            const bucket1 = Bucket.create(5, 1000);
            const bucket2 = Bucket.create(2, 2000);

            repository.save(key, bucket1);
            repository.save(key, bucket2);

            const result = repository.findByKey(key);

            expect(result).toBe(bucket2);
            expect(result).not.toBe(bucket1);

        });

    });


    describe("findByKey()", () => {

        it("should return the bucket associated with the key", () => {

            const repository = makeMemoryBucketRepository();

            const key = "127.0.0.1";
            const bucket = Bucket.create(5, 1000);

            repository.save(key, bucket);

            const result = repository.findByKey(key);

            expect(result).toBe(bucket);

        });


        it("should return undefined when the key does not exist", () => {

            const repository = makeMemoryBucketRepository();

            const result = repository.findByKey("127.0.0.1");

            expect(result).toBeUndefined();

        });

    });


    describe("findAll()", () => {

        it("should return all persisted buckets", () => {

            const repository = makeMemoryBucketRepository();

            const bucket1 = Bucket.create(5, 1000);
            const bucket2 = Bucket.create(5, 2000);

            repository.save("127.0.0.1", bucket1);
            repository.save("127.0.0.2", bucket2);

            const result = repository.findAll();

            expect(result).toHaveLength(2);
        });


        it("should return an empty list when repository is empty", () => {

            const repository = makeMemoryBucketRepository();

            const result = repository.findAll();

            expect(result).toEqual([]);

        });

    });


    describe("remove()", () => {

        it("should remove a bucket by key", () => {

            const repository = makeMemoryBucketRepository();

            const key = "127.0.0.1";
            const bucket = Bucket.create(5, 1000);

            repository.save(key, bucket);

            const result = repository.remove(key);

            expect(result.deleted).toBe(true);
            expect(result.key).toBe(key);

            expect(repository.findByKey(key)).toBeUndefined();

        });


        it("should return false when removing a nonexistent key", () => {

            const repository = makeMemoryBucketRepository();

            const result = repository.remove("127.0.0.1");

            expect(result.deleted).toBe(false);

        });


        it("should not affect another bucket when removing by key", () => {

            const repository = makeMemoryBucketRepository();

            const bucket1 = Bucket.create(5, 1000);
            const bucket2 = Bucket.create(5, 2000);

            repository.save("127.0.0.1", bucket1);
            repository.save("127.0.0.2", bucket2);

            repository.remove("127.0.0.1");

            expect(repository.findByKey("127.0.0.1")).toBeUndefined();
            expect(repository.findByKey("127.0.0.2")).toBe(bucket2);

        });

    });


    describe("removeAll()", () => {

        it("should remove all persisted buckets", () => {

            const repository = makeMemoryBucketRepository();

            const bucket1 = Bucket.create(5, 1000);
            const bucket2 = Bucket.create(5, 2000);

            repository.save("127.0.0.1", bucket1);
            repository.save("127.0.0.2", bucket2);

            repository.removeAll();

            expect(repository.findAll()).toEqual([]);

            expect(
                repository.findByKey("127.0.0.1")
            ).toBeUndefined();

            expect(
                repository.findByKey("127.0.0.2")
            ).toBeUndefined();

        });


        it("should keep repository empty when removeAll is called twice", () => {

            const repository = makeMemoryBucketRepository();

            repository.removeAll();
            repository.removeAll();

            expect(repository.findAll()).toEqual([]);

        });

    });

});