import request from "supertest";
import app from "../../src/app.js";

export default async function consumeTimesEndPoint(key, times) {

    let response;

    for (let i = 0; i < times; i++) {
        response = await request(app)
            .post("/check")
            .send({ key });
    }

    return response;

}