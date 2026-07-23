class ResponseBuilder{

    notFound(res){
        return res.status(404).json({
            message: "Bucket not found"
        });
    }

    found(res, options = {}){
        return res.json({
            message: "Bucket found",
            bucket: options.bucket
        });
    }

    messageEmptyStorage(res){
        return res.json({
            message: "Empty Storage",
            status: false
        })
    }

    messageInternalError(res){
        return res.status(500).json({
            message:"Internal error",
            status: false
        })
    }

    deleted(res, message){
        return res.json({
            status: true,
            message
        });
    }

    consumeSuccess(res, options = {}){
        return res.json({
            message: options.message,
            tokens: options.tokens
        })
    }

    tooManyRequests(res, options = {}){
        return res.status(429).json({
            message: "Muitas requisições. Tente novamente mais tarde.",
            retryAfter: options.retryAfter
        });
    }

}
export default new ResponseBuilder();