import rateLimiterService from "../services/rateLimiter-service.js";
import responseBuilder from "../utils/response-builder.js";
import BucketNotFoundException from "../exceptions/bucket-not-found-exception.js";

class LimitController {

    health(req, res) {
        return res.json({
            message: "Rate limiter is running"
        });
    }


    getAll(req, res) {    
        return res.json(rateLimiterService.getAll());
    }

    getBucketByKey(req, res) {   
        const {id} = req.params;

        const bucket = rateLimiterService.getBucketByKey(id)

        return responseBuilder.found(res,{bucket})
    }

    resetBucket(req, res) {
        const { id } = req.params;
    
        const bucket = rateLimiterService.resetBucket(id);
    
        return res.json(bucket);
    }

    async consume(req, res) {
        const key = this.getClientKey(req)

        const result = await rateLimiterService.consume(key);

        return responseBuilder.consumeSuccess(res, {message:"Request allowed",tokens:result.tokens})
    }

    async deleteAllBuckets(req, res){
        const result = await rateLimiterService.deleteAll();

        return responseBuilder.deleted(res,`All of the buckets were deleted successfully`);
    }

    async deleteBucketById(req, res){
        const {id} = req.params;
        
        const result = await rateLimiterService.deleteBucketByKey(id);

        return responseBuilder.deleted(res,`Bucket ${id} deleted successfully`);
    }

    //Métodos Auxiliares
    getClientKey(req){
        return req.ip.replace(`::ffff:`,``)
    }
}
export default new LimitController();