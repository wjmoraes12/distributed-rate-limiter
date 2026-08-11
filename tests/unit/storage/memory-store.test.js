import { describe, it, expect } from "vitest";

import makeMemoryStore from "../../fixtures/make-memoryStore.js";

describe("Memory Store", () => {

    describe("set()", () => {

        it("should create and persist a value by key", () => {

            const storage = makeMemoryStore();

            const key = "key-1";
            const value = { tokens: 5 };

            storage.set(key, value);

            expect(storage.get(key)).toBe(value);

        });

        it("should replace the value when using an existing key", () => {

            const storage = makeMemoryStore();

            const key = "key-1";

            const firstValue = { tokens: 5 };
            const secondValue = { tokens: 3 };

            storage.set(key, firstValue);
            storage.set(key, secondValue);

            expect(storage.get(key)).toBe(secondValue);

        });

        it("should persist values independently by key", () => {

            const storage = makeMemoryStore();

            const value1 = { tokens: 5 };
            const value2 = { tokens: 3 };

            storage.set("key-1", value1);
            storage.set("key-2", value2);

            expect(storage.get("key-1")).toBe(value1);
            expect(storage.get("key-2")).toBe(value2);

        });

    });


    describe("get()", () => {

        it("should return the value associated with an existing key", () => {

            const storage = makeMemoryStore();

            const key = "key-1";
            const value = { tokens: 5 };

            storage.set(key, value);

            expect(storage.get(key)).toBe(value);

        });

        it("should return undefined for an inexistent key", () => {

            const storage = makeMemoryStore();

            expect(storage.get("inexistent-key")).toBeUndefined();

        });

    });


    describe("getAll()", () => {

        it("should return all stored values", () => {

            const storage = makeMemoryStore();

            const value1 = { tokens: 5 };
            const value2 = { tokens: 3 };

            storage.set("key-1", value1);
            storage.set("key-2", value2);

            const result = storage.getAll();

            expect(result).toHaveLength(2);
        });

        it("should return an empty array when storage is empty", () => {

            const storage = makeMemoryStore();

            expect(storage.getAll()).toEqual([]);

        });

    });


    describe("delete()", () => {

        it("should delete an existing value", () => {

            const storage = makeMemoryStore();

            const key = "key-1";
            const value = { tokens: 5 };

            storage.set(key, value);

            const result = storage.delete(key);

            expect(result.deleted).toBe(true);
            expect(storage.get(key)).toBeUndefined();

        });

        it("should return false when deleting an inexistent key", () => {

            const storage = makeMemoryStore();

            const result = storage.delete("inexistent-key");

            expect(result.deleted).toBe(false);

        });

        it("should not affect other keys when deleting one value", () => {

            const storage = makeMemoryStore();

            const value1 = { tokens: 5 };
            const value2 = { tokens: 3 };

            storage.set("key-1", value1);
            storage.set("key-2", value2);

            storage.delete("key-1");

            expect(storage.get("key-1")).toBeUndefined();
            expect(storage.get("key-2")).toBe(value2);

        });

    });


    describe("deleteAll()", () => {

        it("should delete all stored values", () => {

            const storage = makeMemoryStore();

            storage.set("key-1", { tokens: 5 });
            storage.set("key-2", { tokens: 3 });

            const result = storage.deleteAll();

            expect(storage.getAll()).toEqual([]);
            expect(result.isEmpty).toBe(true);

        });

        it("should keep the storage empty when deleting all from an empty storage", () => {

            const storage = makeMemoryStore();

            const result = storage.deleteAll();

            expect(storage.getAll()).toEqual([]);
            expect(result.isEmpty).toBe(true);

        });

    });

});

