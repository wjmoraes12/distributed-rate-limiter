import InvalidKeyRequest from "../exceptions/invalid-key-request.js";

const securityMiddleware = (detector, logger) => {

    return (req, res, next) => {

        const content = JSON.stringify({
            body: req.body,
            params: req.params,
            query: req.query
        });

        const result = detector.detect(content);

        if (!result.suspicious) {
            return next();
        }

        logger.warn("Invalid key received");

        return next(new InvalidKeyRequest());
    };
};

export default securityMiddleware;