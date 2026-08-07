import request from "supertest";
import app from "../../../src/app.js";
import consumeTimesEndPoint from "../../helpers/consumeTimesEndPoint-helper.js";
import expectSuccess from "../../fixtures/expect-success.js";
import { getAllBuckets, getBucketByKey } from "../../helpers/get-helper.js";

describe("get /bucket", () => {

    it("should return all buckets", async () => {

        const response = await consumeTimesEndPoint(crypto.randomUUID(),5);
        expectSuccess(response)

        expect(response.body.tokens).toBe(0);

        const response2 = await consumeTimesEndPoint(crypto.randomUUID(),3);
        expectSuccess(response2)
        expect(response2.body.tokens).toBe(2);

        const buckets = await getAllBuckets();
        expect(buckets.body).toHaveLength(2)

    });
});

describe("get /bucket/:id", () => {
    
    it("should return a bucket by key", async () => {

        const key = crypto.randomUUID();
        const response = await consumeTimesEndPoint(key,5);
        expectSuccess(response)

        expect(response.body.tokens).toBe(0);

        const buckets = await getBucketByKey(key);
        expect(buckets.body.bucket.tokens).toBe(0)

    });

    it("should return 404 when the bucket does not exist", async () => {

        const key = crypto.randomUUID();
        const response = await consumeTimesEndPoint(key,5);
        expectSuccess(response)

        expect(response.body.tokens).toBe(0);

        const buckets = await getBucketByKey("127.0.0.1");
        expect(buckets.body.message).toBe("Bucket not found")
        expect(buckets.status).toBe(404)

    });

});