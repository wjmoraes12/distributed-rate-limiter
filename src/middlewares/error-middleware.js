import BucketNotFoundException from "../exceptions/bucket-not-found-exception.js";
import RateLimitExceededException from "../exceptions/rate-limit-exceeded-exception.js";
import StorageIsEmptyException from "../exceptions/storage-is-empty-exception.js";
import InvalidKeyRequest from "../exceptions/invalid-key-request.js";
import SecurityProblemException from "../exceptions/security-problem-exception.js";

import responseBuilder from "../utils/response-builder.js";

export default function createErrorMiddleware(logger) {

    return function errorMiddleware(error, req, res, next) {

        logger.error(error.message, {

            exception: error.constructor.name,

            method: req.method,

            path: req.originalUrl,

            stack: error.stack

        });

        if (error instanceof BucketNotFoundException) {
            return responseBuilder.notFound(res);
        }

        if (error instanceof RateLimitExceededException) {
            return responseBuilder.tooManyRequests(res, {
                retryAfter: error.retryAfter
            });
        }

        if (error instanceof StorageIsEmptyException) {
            return responseBuilder.messageIsNotDeleted(res);
        }

        if (error instanceof InvalidKeyRequest) {
            return responseBuilder.invalidKeyRequest(res);
        }

        if (error instanceof SyntaxError) {
            return responseBuilder.syntaxError(res);
        }

        if (error instanceof SecurityProblemException) {
            return responseBuilder.securityError(res);
        }

        return responseBuilder.messageInternalError(res);

    };

}