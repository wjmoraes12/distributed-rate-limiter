class ResponseBuilder {

    notFound(res) {
        return res.status(404).json({
            message: "Bucket not found",
            status: false
        });
    }

    found(res, options = {}) {
        return res.status(200).json({
            message: "Bucket retrieved successfully",
            status: true,
            bucket: options.bucket
        });
    }

    messageEmptyStorage(res) {
        return res.status(200).json({
            message: "No buckets found",
            status: false
        });
    }

    messageInternalError(res) {
        return res.status(500).json({
            message: "An internal server error occurred",
            status: false
        });
    }

    deleted(res, message = "Bucket deleted successfully") {
        return res.status(200).json({
            status: true,
            message
        });
    }

    consumeSuccess(res, options = {}) {
        return res.status(200).json({
            message: options.message || "Request allowed",
            status: true,
            tokens: options.tokens
        });
    }

    tooManyRequests(res, options = {}) {
        return res.status(429).json({
            message: "Too many requests. Please try again later.",
            status: false,
            retryAfter: options.retryAfter
        });
    }

    invalidKeyRequest(res) {
        return res.status(400).json({
            message: "Invalid request key",
            status: false
        });
    }

    syntaxError(res) {
        return res.status(400).json({
            message: "Invalid request syntax",
            status: false
        });
    }

    securityError(res) {
        return res.status(403).json({
            message: "Security violation detected",
            status: false
        });
    }

}

export default new ResponseBuilder();