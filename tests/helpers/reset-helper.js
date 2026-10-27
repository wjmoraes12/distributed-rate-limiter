import request from "supertest";
import app from "../../src/app.js";

export default async function reset(key) {
    return await request(app).patch(`/buckets/${key}/reset`);
}

