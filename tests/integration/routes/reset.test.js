import request from "supertest";
import app from "../../../src/app.js";
import consumeTimesEndPoint from "../../helpers/consumeTimesEndPoint-helper.js";
import reset from "../../helpers/reset-helper.js";
import expectSuccess from "../../fixtures/expect-success.js";

describe("PATCH /buckets", () => {

    it("should reset all of the tokens by a key", async () => {

        const key = crypto.randomUUID();

        const response = await consumeTimesEndPoint(key, 5);

        expectSuccess(response)
        expect(response.body.tokens).toBe(0);
    
        const buckets = await reset(key);
    
        expectSuccess(response)
        expect(buckets.body.message).toBe("Bucket found");
        expect(buckets.body.bucket.tokens).toBe(5);
    
    });

    it("should limite the quantity of tokens no matter how request to reset it makes", async () => {

        const key = crypto.randomUUID();

        const response = await consumeTimesEndPoint(key, 5);

        let buckets = await reset(key);
        expect(buckets.body.bucket.tokens).toBe(5);

        buckets = await consumeTimesEndPoint(key,1);
        expect(buckets.body.tokens).toBe(4);

        buckets = await reset(key);
        expect(buckets.body.bucket.tokens).toBe(5);

        buckets = await reset(key);
        expect(buckets.body.bucket.tokens).toBe(5);

    });

    it("should return 404 when bucket does not exist", async () => {

        const key = crypto.randomUUID();

        const buckets = await reset(key);
    
        expect(buckets.status).toBe(404);
        expect(buckets.headers["content-type"]).toContain("application/json");
        expect(buckets.body.message).toBe("Bucket not found");
    
    });
});