import request from "supertest";
import app from "../../src/app.js";

export async function getBucketByKey(key) {
    return request(app)
        .get(`/buckets/${key}`);
}

export async function getAllBuckets() {
    return request(app)
        .get(`/buckets`);
}
