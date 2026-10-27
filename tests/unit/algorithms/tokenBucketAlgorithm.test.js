import { describe, it, expect } from "vitest";

import makeAlgorithm from "../../fixtures/make-algorithm.js";
import consumeTimes from "../../helpers/consumeTimes-helper.js";
import { deleteAllBuckets } from "../../helpers/get-helper.js";

const KEY = "127.0.0.1";
const KEY2 = "127.0.0.2";
const KEY3 = "127.0.0.3";

describe("TokenBucketAlgorithm", () => {

    describe("Consume", () => {

        it("should create a bucket automatically", async () => {

            const { algorithm } = makeAlgorithm();

            const result = await algorithm.consume(KEY);

            expect(result.allowed).toBe(true);

            expect(algorithm.getBucketByKey(KEY)).toBeDefined();

        });

        it("should consume exactly one token", async () => {

            const { algorithm } = makeAlgorithm();

            const result = await algorithm.consume(KEY);

            expect(result.tokens).toBe(4);

        });

        it("should consume two tokens", async () => {
            const { algorithm } = makeAlgorithm();
        
            await consumeTimes(algorithm, KEY, 2);
        
            const result = await algorithm.consume(KEY);
        
            expect(result.tokens).toBe(2);
        });

        it("should consume until bucket becomes empty", async () => {
            deleteAllBuckets();
        
            const { algorithm } = makeAlgorithm();
        
            await consumeTimes(algorithm, KEY, 5);
        
            const bucket = await algorithm.getBucketByKey(KEY);
                
            expect(bucket.tokens).toBe(0);
        });

        it("should deny the sixth request", async () => {

            const { algorithm } = makeAlgorithm();
        
            const result = await consumeTimes(algorithm, KEY, 6);
                
            expect(result.allowed).toBe(false);
            expect(result.retryAfter).toBe(100);
        
        });

    });

    describe("Refill", () => {

        it("should return remaining time until next refill", async () => {

            const { algorithm, clock } = makeAlgorithm();

            await consumeTimes(algorithm,KEY,6);

            clock.advance(99000);

            const result = await algorithm.consume(KEY);

            expect(result.allowed).toBe(false);
            expect(result.retryAfter).toBe(1);

        });

        it("should allow request after one refill interval", async () => {

            const { algorithm, clock } = makeAlgorithm();

            await consumeTimes(algorithm,KEY,6);

            clock.advance(100_000);

            const result = await algorithm.consume(KEY);

            expect(result.allowed).toBe(true);
            expect(result.tokens).toBe(0);

        });

        it("should refill two tokens after waiting 250ms", async () => {

            const { algorithm, clock } = makeAlgorithm();

            await consumeTimes(algorithm,KEY,6);

            clock.advance(250_000);

            const result = await algorithm.consume(KEY);

            expect(result.tokens).toBe(1);

        });

        it("should never exceed maximum capacity", async () => {

            const { algorithm, clock } = makeAlgorithm();

            await consumeTimes(algorithm,KEY,6);

            clock.advance(999999999);

            await algorithm.consume(KEY);
            const bucket = await algorithm.getBucketByKey(KEY);

            expect(bucket.tokens).toBe(4);

        });

    });

    describe("Get Or Create Bucket", () => {

        it("should initialize bucket with valid values", async () => {

            const { algorithm } = makeAlgorithm();

            const bucket = await algorithm.getOrCreateBucket(KEY);

            expect(bucket.tokens).toBe(5);
            expect(bucket.updatedAt).toBeDefined();

        });

    });

    describe("Get Bucket", () => {

        it("should get a Bucket after the creation", async () => {

            const { algorithm } = makeAlgorithm();
            let bucket = await algorithm.getOrCreateBucket(KEY);
            bucket = await algorithm.consume(KEY);
            expect(bucket.tokens).toBe(4);
            
        });

    });

    describe("Reset", () => {

        it("should restore maximum capacity", async () => {

            const { algorithm } = makeAlgorithm();

            await consumeTimes(algorithm,KEY,5);

            const bucket = await algorithm.resetBucket(KEY);

            expect(bucket.tokens).toBe(5);

        });

        it("should not exceed maximum capacity after multiple resets", async () => {

            const { algorithm } = makeAlgorithm();

            await consumeTimes(algorithm,KEY,5);

            await algorithm.resetBucket(KEY);

            const bucket = await algorithm.resetBucket(KEY);

            expect(bucket.tokens).toBe(5);

        });

        it("should return null when bucket does not exist", async () => {

            const { algorithm } = makeAlgorithm();

            const bucket = await algorithm.resetBucket(KEY);

            expect(bucket).toBe(null);

        });

    });

    describe("Delete", () => {

        it("should delete one bucket", async () => {

            const { algorithm } = makeAlgorithm();

            await algorithm.consume(KEY);

            const bucketByKey = await algorithm.deleteBucketByKey(KEY);
            expect(bucketByKey.deleted).toBe(true);

            const bucket = await algorithm.getBucketByKey(KEY);
            expect(bucket).toBeUndefined();
        });

    });

    describe("Delete All", () => {

        it("should delete every bucket", async () => {

            const { algorithm } = makeAlgorithm();

            await algorithm.consume(KEY);
            await algorithm.consume(KEY2);

            await algorithm.deleteAll();

            const listAllOfBuckets = await algorithm.getAll()

            expect(listAllOfBuckets).toHaveLength(0);

        });

    });

    describe("Multiple Buckets", () => {

        it("should create independent buckets", async () => {

            const { algorithm } = makeAlgorithm();

            await algorithm.consume(KEY);
            await algorithm.consume(KEY2);

            const listAllOfBuckets = await algorithm.getAll()

            expect(listAllOfBuckets).toHaveLength(2);

        });

        it("should keep buckets isolated", async () => {

            const { algorithm } = makeAlgorithm();

            await algorithm.consume(KEY);

            await algorithm.consume(KEY2);

            const bucket1 = await algorithm.getBucketByKey(KEY);
            const bucket2 = await algorithm.getBucketByKey(KEY2);

            expect(bucket1.tokens).toBe(4);

            expect(bucket2.tokens).toBe(4);

        });

    });

    describe("Invalid Inputs", () => {

        it("should throw an error for invalid inputs", async () => {

            const { algorithm } = makeAlgorithm();
        
            await expect(algorithm.consume(undefined)).rejects.toThrow("Invalid key");
            await expect(algorithm.consume(null)).rejects.toThrow("Invalid key");
            await expect(algorithm.consume(NaN)).rejects.toThrow("Invalid key");
        
        });
    });


});