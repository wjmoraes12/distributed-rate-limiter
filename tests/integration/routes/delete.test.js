import request from "supertest";
import app from "../../../src/app.js";
import consumeTimesEndPoint from "../../helpers/consumeTimesEndPoint-helper.js";
import { deleteAll, deleteByKey } from "../../helpers/delete-helper.js";
import expectSuccess from "../../fixtures/expect-success.js";

describe("DELETE /bucket", () => {

    it("should delete all of the buckets", async () => {

        const response = await consumeTimesEndPoint(crypto.randomUUID(),5);
        expectSuccess(response)

        expect(response.body.tokens).toBe(0);

        const response2 = await consumeTimesEndPoint(crypto.randomUUID(),3);
        expectSuccess(response2)
        expect(response2.body.tokens).toBe(2);

        const buckets = await deleteAll();
        expectSuccess(buckets)

    });

    it("should delete a bucket by Key(ID)", async () => {

        const key = crypto.randomUUID();

        const response = await consumeTimesEndPoint(key,4);
        expect(response.status).toBe(200);
        expect(response.headers["content-type"]).toContain("application/json");
        expect(response.body.tokens).toBe(1);

        const buckets = await deleteByKey(key);

        expectSuccess(response)
        expect(buckets.body.message).toBe(`Bucket ${key} deleted successfully`);

    });

    it("should return 404 when bucket does not exist", async () => {

        const key = crypto.randomUUID();

        const response = await consumeTimesEndPoint(key,4);
        expect(response.status).toBe(200);
        expect(response.headers["content-type"]).toContain("application/json");
        expect(response.body.tokens).toBe(1);

        const buckets = await deleteByKey("127.0.0.1");

        expect(buckets.status).toBe(404);
        expect(buckets.headers["content-type"]).toContain("application/json");
        expect(buckets.body.message).toBe(`Bucket not found`);

    });

});