import rateLimiterService from "../services/rateLimiter-service.js";
import responseBuilder from "../utils/response-builder.js";

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
        try {
            const bucket = rateLimiterService.getBucketByKey(id)

            if(!bucket){
                return responseBuilder.notFound(res)
            }

            return responseBuilder.found(res,{bucket})
        } catch (error) {
            return responseBuilder.messageInternalError(res)
        }
    }

    resetBucket(req, res) {
        const { id } = req.params;
    
        try {
            const bucket = rateLimiterService.resetBucket(id);

            if (!bucket) {
                return responseBuilder.notFound(res)
            }
    
            return res.json(bucket);
    
        } catch (error) {
            return responseBuilder.messageInternalError(res)
        }
    }

    async consume(req, res) {
        try{
            const key = this.getClientKey(req)
            const result = await rateLimiterService.consume(key);
            console.log(result)
            if (!result.allowed) {
                return responseBuilder.tooManyRequests(res,{retryAfter : result.retryAfter})
            }

            return responseBuilder.consumeSuccess(res, {message:"Request allowed",tokens:result.tokens})

        }catch(error){
            return responseBuilder.messageInternalError(res)
        }
    }

    async deleteAllBuckets(req, res){
        try {
            const result = await rateLimiterService.deleteAll();

            if(!result.isEmpty){
                return responseBuilder.messageIsNotDeleted(res)
            }

            return responseBuilder.deleted(res,`All of the buckets were deleted successfully`);

        } catch (error) {
            console.log(error)
            return responseBuilder.messageInternalError(res)
        }
    }

    async deleteBucketById(req, res){
        const {id} = req.params;
        try {
            const result = await rateLimiterService.deleteBucketByKey(id);

            if(!result.deleted){
                return responseBuilder.messageIsNotDeleted(res)
            }

            return responseBuilder.deleted(res,`Bucket ${id} deleted successfully`);
            
        } catch (error) {
            return responseBuilder.messageInternalError(res)
        }
    }

    //Métodos Auxiliares
    getClientKey(req){
        return req.ip.replace(`::ffff:`,``)
    }
}
export default new LimitController();