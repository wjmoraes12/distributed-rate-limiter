import { describe, it, expect } from "vitest";

import makeAlgorithm from "../../fixtures/make-algorithm.js";
import consumeTimes from "../../helpers/consumeTimes-helper.js";
import { errorMiddleware } from "../../../src/config/bootstrap.js";

const KEY = "127.0.0.1";
const KEY2 = "127.0.0.2";
const KEY3 = "127.0.0.3";

describe("TokenBucketAlgorithm", () => {

    describe("Consume", () => {

        it("should create a bucket automatically", () => {

            const { algorithm } = makeAlgorithm();

            const result = algorithm.consume(KEY);

            expect(result.allowed).toBe(true);

            expect(algorithm.getBucketByKey(KEY)).toBeDefined();

        });

        it("should consume exactly one token", () => {

            const { algorithm } = makeAlgorithm();

            const result = algorithm.consume(KEY);

            expect(result.tokens).toBe(4);

        });

        it("should consume two tokens", () => {

            const { algorithm } = makeAlgorithm();

            consumeTimes(algorithm, KEY, 1);

            expect(algorithm.consume(KEY).tokens).toBe(3);

        });

        it("should consume until bucket becomes empty", () => {

            const { algorithm } = makeAlgorithm();

            consumeTimes(algorithm, KEY, 5);

            expect(algorithm.getBucketByKey(KEY).tokens).toBe(0);

        });

        it("should deny the sixth request", () => {

            const { algorithm } = makeAlgorithm();

            const result = consumeTimes(algorithm,KEY,6);

            expect(result.allowed).toBe(false);
            expect(result.retryAfter).toBe(100);

        });

    });

    describe("Refill", () => {

        it("should return remaining time until next refill", () => {

            const { algorithm, clock } = makeAlgorithm();

            consumeTimes(algorithm,KEY,6);

            clock.advance(99000);

            const result = algorithm.consume(KEY);

            expect(result.allowed).toBe(false);
            expect(result.retryAfter).toBe(1);

        });

        it("should allow request after one refill interval", () => {

            const { algorithm, clock } = makeAlgorithm();

            consumeTimes(algorithm,KEY,6);

            clock.advance(100_000);

            const result = algorithm.consume(KEY);

            expect(result.allowed).toBe(true);
            expect(result.tokens).toBe(0);

        });

        it("should refill two tokens after waiting 250ms", () => {

            const { algorithm, clock } = makeAlgorithm();

            consumeTimes(algorithm,KEY,6);

            clock.advance(250_000);

            const result = algorithm.consume(KEY);

            expect(result.tokens).toBe(1);

        });

        it("should never exceed maximum capacity", () => {

            const { algorithm, clock } = makeAlgorithm();

            consumeTimes(algorithm,KEY,6);

            clock.advance(999999999);

            algorithm.consume(KEY);

            expect(algorithm.getBucketByKey(KEY).tokens).toBe(4);

        });

    });

    describe("Get Or Create Bucket", () => {

        it("should initialize bucket with valid values", () => {

            const { algorithm } = makeAlgorithm();

            const bucket = algorithm.getOrCreateBucket(KEY);

            expect(bucket.tokens).toBe(5);
            expect(bucket.updatedAt).toBeDefined();

        });

    });

    describe("Get Bucket", () => {

        it("should get a Bucket after the creation", () => {

            const { algorithm } = makeAlgorithm();
            const bucket = algorithm.getOrCreateBucket(KEY);
            expect(algorithm.consume(KEY).tokens).toBe(4);
            

        });

    });

    describe("Get All", () => {

        it("should not create duplicated buckets for the same key", () => {

            const { algorithm } = makeAlgorithm();

            algorithm.consume(KEY);

            expect(algorithm.getAll()).toHaveLength(1);

        });

        it("should return every created bucket", () => {

            const { algorithm } = makeAlgorithm();

            algorithm.consume(KEY);
            algorithm.consume(KEY2);
            algorithm.consume(KEY3);

            expect(algorithm.getAll()).toHaveLength(3);

        });

    });

    describe("Reset", () => {

        it("should restore maximum capacity", () => {

            const { algorithm } = makeAlgorithm();

            consumeTimes(algorithm,KEY,5);

            const bucket = algorithm.resetBucket(KEY);

            expect(bucket.tokens).toBe(5);

        });

        it("should not exceed maximum capacity after multiple resets", () => {

            const { algorithm } = makeAlgorithm();

            consumeTimes(algorithm,KEY,5);

            algorithm.resetBucket(KEY);

            const bucket = algorithm.resetBucket(KEY);

            expect(bucket.tokens).toBe(5);

        });

        it("should return null when bucket does not exist", () => {

            const { algorithm } = makeAlgorithm();

            expect(algorithm.resetBucket(KEY)).toBe(null);

        });

    });

    describe("Delete", () => {

        it("should delete one bucket", () => {

            const { algorithm } = makeAlgorithm();

            algorithm.consume(KEY);

            expect(algorithm.deleteBucketByKey(KEY).deleted).toBe(true);

            expect(algorithm.getBucketByKey(KEY)).toBeUndefined();

        });

    });

    describe("Delete All", () => {

        it("should delete every bucket", () => {

            const { algorithm } = makeAlgorithm();

            algorithm.consume(KEY);
            algorithm.consume(KEY2);

            algorithm.deleteAll();

            expect(algorithm.getAll()).toHaveLength(0);

        });

    });

    describe("Multiple Buckets", () => {

        it("should create independent buckets", () => {

            const { algorithm } = makeAlgorithm();

            algorithm.consume(KEY);
            algorithm.consume(KEY2);

            expect(algorithm.getAll()).toHaveLength(2);

        });

        it("should keep buckets isolated", () => {

            const { algorithm } = makeAlgorithm();

            algorithm.consume(KEY);

            algorithm.consume(KEY2);

            expect(algorithm.getBucketByKey(KEY).tokens).toBe(4);

            expect(algorithm.getBucketByKey(KEY2).tokens).toBe(4);

        });

    });

    describe("Invalid Inputs", () => {

        it("should throw an error for invalid inputs", () => {

            const { algorithm } = makeAlgorithm();
        
            expect(() => algorithm.consume(undefined)).toThrow("Invalid key");
            expect(() => algorithm.consume(null)).toThrow("Invalid key");
            expect(() => algorithm.consume(NaN)).toThrow("Invalid key");
            expect(algorithm.consume(KEY).tokens).toBe(4)
        
        });
    });


});