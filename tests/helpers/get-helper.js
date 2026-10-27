import request from "supertest";
import app from "../../src/app.js";

export async function getBucketByKey(key) {
    return await request(app).get(`/buckets/${key}`);
}

export async function deleteAllBuckets() {
    return await request(app).delete("/buckets");
}

export async function getAllBuckets() {
    return await request(app).get("/buckets");
}