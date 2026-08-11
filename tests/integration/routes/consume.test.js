import request from "supertest";
import app from "../../../src/app.js";
import consumeTimesEndPoint from "../../helpers/consumeTimesEndPoint-helper.js"
import expectSuccess from "../../fixtures/expect-success.js";
import tooManyRequests from "../../fixtures/tooManyRequests.js";

describe("POST /check", () => {

    it("should deny the sixth request", async () => {

        const response = await consumeTimesEndPoint(crypto.randomUUID(),6);
    
        tooManyRequests(response)
        expect(response.body.retryAfter).toBe(100);
    
    });

    it("should consume  1 token in each request, being the five request the last one", async () => {
        const key = crypto.randomUUID();

        let response
        for (let x = 0; x < 5; x++) {
            response = await consumeTimesEndPoint(key, 1);
            expect(response.body.tokens).toBe(4 - x);
        }

        response = await consumeTimesEndPoint(key,1);
        tooManyRequests(response)
    
    });

    it("should return the time to refill the next token", async () => {

        const response = await consumeTimesEndPoint(crypto.randomUUID(),6);
    
        tooManyRequests(response)
        expect(response.body.retryAfter).toBe(100);
    
    });

});