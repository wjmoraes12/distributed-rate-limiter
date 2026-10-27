
import { createClient } from "redis";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import Storage from "../interfaces/Storage.js";

const currentDirectory = dirname(fileURLToPath(import.meta.url));

const consumeScriptPath = resolve(
    currentDirectory,
    "scripts",
    "consume.lua"
);

const consumeScriptPromise = readFile(consumeScriptPath, "utf8");

const escapeGlob = (text) => text.replace(/[\\*?[\]]/g, "\\$&");

class RedisStore extends Storage {
    constructor({
        url,
        prefix = "rate-limiter:bucket:",
        ttlSeconds = 750,
        scanCount = 500,
        batchSize = 100
    } = {}) {
        super();

        if (!prefix || typeof prefix !== "string") {
            throw new Error("Redis prefix must be a non-empty string");
        }

        if (ttlSeconds !== null &&(!Number.isInteger(ttlSeconds) || ttlSeconds < 1)) {
            throw new Error("TTL must be null or a positive integer");
        }

        this.redis = createClient({ url });

        this.redis.on("error", (err) =>
            console.error("[redis] erro:", err.message)
        );

        this.prefix = prefix;
        this.ttlSeconds = ttlSeconds;
        this.scanCount = scanCount;
        this.batchSize = batchSize;
        this.pattern = `${escapeGlob(prefix)}*`;
    }

    async connect() {
        if (!this.redis.isOpen) {
            await this.redis.connect();
        }
    }

    async disconnect() {
        if (this.redis.isOpen) {
            await this.redis.quit();
        }
    }

    async get(key) {
        const data = await this.redis.hGetAll(this.redisKey(key));

        if (Object.keys(data).length === 0) {
            return null;
        }

        return this.deserialize(data);
    }

    async getAll() {
        const buckets = new Map();

        for await (const keys of this.scanKeys()) {
            const pipeline = this.redis.multi();

            keys.forEach((redisKey) => {
                pipeline.hGetAll(redisKey);
            });

            const results = await pipeline.execAsPipeline();

            results.forEach((data, i) => {
                if (!data || Object.keys(data).length === 0) {
                    return;
                }

                const key = this.domainKey(keys[i]);

                buckets.set(key, {
                    key,
                    ...this.deserialize(data)
                });
            });
            
        }

        return [...buckets.values()];
    }

    async set(key, value) {
        const redisKey = this.redisKey(key);
        const fields = this.serialize(value);

        const tx = this.redis.multi().del(redisKey);

        if (Object.keys(fields).length > 0) {
            tx.hSet(redisKey, fields);

            if (this.ttlSeconds !== null) {
                tx.expire(redisKey, this.ttlSeconds);
            }
        }

        await tx.exec();

        return value;
    }

    async updateBucket(key, data) {
        const redisKey = this.redisKey(key);
        const fields = this.serialize(data);

        if (Object.keys(fields).length === 0) {
            return data;
        }

        const tx = this.redis
            .multi()
            .hSet(redisKey, fields);

        if (this.ttlSeconds !== null) {
            tx.expire(redisKey, this.ttlSeconds);
        }

        await tx.exec();

        return data;
    }

    async consumeToken(
        key,
        {
            capacity,
            refillAmount,
            refillTimeMs
        }
    ) {
        if (typeof key !== "string" || key.trim() === "") {
            throw new Error("Invalid key");
        }

        const result = await this.redis.eval(
            await consumeScriptPromise,
            {
                keys: [this.redisKey(key)],
                arguments: [
                    String(capacity),
                    String(refillAmount),
                    String(refillTimeMs),
                    String(this.ttlSeconds ?? 0)
                ]
            }
        );

        if (!Array.isArray(result) || result.length !== 4) {
            throw new Error("Invalid response from consume.lua");
        }

        const [allowed, tokens, retryAfter, updatedAt] = result;

        return {
            allowed: Number(allowed) === 1,
            tokens: Number(tokens),
            retryAfter: Number(retryAfter),
            updatedAt: Number(updatedAt)
        };
    }

    async delete(key) {
        const removed = await this.redis.del(
            this.redisKey(key)
        );

        return {
            deleted: removed > 0,
            key
        };
    }

    async deleteAll() {
        let deletedBuckets = 0;

        for await (const keys of this.scanKeys()) {
            if (keys.length === 0) {
                continue;
            }

            deletedBuckets += await this.redis.unlink(keys);
        }

        let isEmpty = true;

        for await (const _ of this.scanKeys()) {
            isEmpty = false;
            break;
        }

        return {
            deletedBuckets,
            isEmpty
        };
    }

    redisKey(key) {
        return `${this.prefix}${key}`;
    }

    domainKey(redisKey) {
        return redisKey.slice(this.prefix.length);
    }

    serialize(value) {
        const fields = {};

        for (const [field, fieldValue] of Object.entries(value ?? {})) {
            if (
                fieldValue !== undefined &&
                fieldValue !== null
            ) {
                fields[field] = String(fieldValue);
            }
        }

        return fields;
    }

    deserialize(data) {
        const bucket = {};

        for (const [field, raw] of Object.entries(data)) {
            const asNumber = Number(raw);

            bucket[field] =
                raw !== "" && Number.isFinite(asNumber)
                    ? asNumber
                    : raw;
        }

        return bucket;
    }

    async *scanKeys() {
        let chunk = [];

        for await (const item of this.redis.scanIterator({
            MATCH: this.pattern,
            COUNT: this.scanCount
        })) {
            chunk.push(
                ...(Array.isArray(item) ? item : [item])
            );

            if (chunk.length >= this.batchSize) {
                yield chunk;
                chunk = [];
            }
        }

        if (chunk.length > 0) {
            yield chunk;
        }
    }
}

export default RedisStore;