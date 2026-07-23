
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

    getAll(req, res) {
        return res.json(this.service.getAll());
    }

    getBucketByKey(req, res) {

        const { id } = req.params;

        const bucket = this.service.getBucketByKey(id);

        return responseBuilder.found(res, {
            bucket
        });
    }

    resetBucket(req, res) {

        const { id } = req.params;

        const bucket = this.service.resetBucket(id);

        return responseBuilder.found(res, {
            bucket
        });

    }

    consume(req, res) {

        const key = this.getClientKey(req);

        const result = this.service.consume(key);

        return responseBuilder.consumeSuccess(
            res,
            {
                message: "Request allowed",
                tokens: result.tokens
            }
        );
    }

    deleteAllBuckets(req, res) {

        this.service.deleteAll();

        return responseBuilder.deleted(
            res,
            "All buckets were deleted successfully"
        );

    }

    deleteBucketById(req, res) {

        const { id } = req.params;

        this.service.deleteBucketByKey(id);

        return responseBuilder.deleted(
            res,
            `Bucket ${id} deleted successfully`
        );

    }

    getClientKey(req) {
        return req.ip.replace("::ffff:", "");
    }

}

export default LimitController;