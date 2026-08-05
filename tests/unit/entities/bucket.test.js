import { describe, it, expect } from "vitest";

import Bucket from "../../../src/entities/Bucket.js";

describe("Bucket Entity", () => {

    describe("create()", () => {

        it("should create a bucket with maximum capacity", () => {

            const bucket = Bucket.create(5, 0);

            expect(bucket.tokens).toBe(5);

            expect(bucket.updatedAt).toBe(0);

        });

    });

    describe("consume()", () => {

        it("should consume exactly one token", () => {

            const bucket = Bucket.create(5, 0);

            bucket.consume();

            expect(bucket.tokens).toBe(4);

        });

        it("should never become negative", () => {

            const bucket = Bucket.create(5, 0);

            bucket.consume();
            bucket.consume();
            bucket.consume();
            bucket.consume();
            bucket.consume();

            expect(bucket.tokens).toBe(0);

        });

    });

    describe("canConsume()", () => {

        it("should return true when bucket has tokens", () => {

            const bucket = Bucket.create(5, 0);

            expect(bucket.canConsume()).toBe(true);

        });

        it("should return false when bucket is empty", () => {

            const bucket = Bucket.create(5, 0);

            bucket.tokens = 0;

            expect(bucket.canConsume()).toBe(false);

        });

    });

    describe("reset()", () => {

        it("should restore bucket to maximum capacity", () => {

            const bucket = Bucket.create(5, 0);

            bucket.consume();

            bucket.consume();

            bucket.reset(5, 100);

            expect(bucket.tokens).toBe(5);

            expect(bucket.updatedAt).toBe(100);

        });

    });

});