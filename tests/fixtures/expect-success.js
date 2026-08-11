import request from "supertest";

export default function expectSuccess(response) {
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toContain("application/json");

}