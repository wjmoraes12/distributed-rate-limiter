
import responseBuilder from "../utils/response-builder.js";
class LimitController {

    constructor(service) {
        this.service = service;
    }

    health(req, res) {
        return res.json({
            message: "Rate limiter is running"
        });
    }

    async getAll(req, res) {
        return await res.json(await this.service.getAll());
    }

    async getBucketByKey(req, res) {

        const { id } = req.params;

        const bucket = await this.service.getBucketByKey(id);

        return responseBuilder.found(res, {
            bucket
        });
    }

    async resetBucket(req, res) {

        const { id } = req.params;

        const bucket = await this.service.resetBucket(id);
        return responseBuilder.found(res, {
            bucket
        });

    }

    async consume(req, res) {

        const key = this.getClientKey(req);

        const result = await this.service.consume(key);
        return responseBuilder.consumeSuccess(
            res,
            {
                message: "Request allowed",
                tokens: result.tokens
            }
        );
    }

    async deleteAllBuckets(req, res) {

        await this.service.deleteAll();

        return responseBuilder.deleted(
            res,
            "All buckets were deleted successfully"
        );

    }

    async deleteBucketById(req, res) {

        const { id } = req.params;

        await this.service.deleteBucketByKey(id);

        return responseBuilder.deleted(
            res,
            `Bucket ${id} deleted successfully`
        );

    }

    getClientKey(req) {

        if (process.env.NODE_ENV === "test") {
            return req.body.key ?? req.ip.replace("::ffff:", "");
        }
    
        return req.ip.replace("::ffff:", "");
    
    }

}

export default LimitController;