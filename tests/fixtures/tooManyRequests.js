import request from "supertest";

export default function tooManyRequests(response) {
    expect(response.status).toBe(429);
    expect(response.headers["content-type"]).toContain("application/json");

}