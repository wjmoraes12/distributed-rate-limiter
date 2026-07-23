import responseBuilder from "../utils/response-builder.js";
import BucketNotFoundException from "../exceptions/bucket-not-found-exception.js";
import RateLimitExceededException from "../exceptions/rate-limit-exceeded-exception.js";
import StorageIsEmptyException from "../exceptions/storage-is-empty-exception.js";

export default function errorMiddleware(error, req, res, next) {

    if (error instanceof BucketNotFoundException) {
        return responseBuilder.notFound(res);
    }

    if (error instanceof RateLimitExceededException) {
        return responseBuilder.tooManyRequests(res, {
            retryAfter: error.retryAfter
        });
    }

    if (error instanceof StorageIsEmptyException) {
        return responseBuilder.messageEmptyStorage(res);
    }
    console.log(error)
    return responseBuilder.messageInternalError(res);
}