import request from "supertest";
import app from "../../src/app.js";

export async function deleteAll() {
    return request(app)
        .delete("/buckets");
}

export async function deleteByKey(key) {
    return request(app)
        .delete(`/buckets/${key}`);
}

