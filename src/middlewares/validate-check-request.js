import InvalidKeyRequest from "../exceptions/invalid-key-request.js";

export default function validateCheckRequest(logger) {

    return (req, res, next) => {

        const key = req.body?.key ?? req.params?.id;

        if (typeof key !== "string" || key.trim() === "") {

            logger.warn("Invalid key received");

            return next(new InvalidKeyRequest());
        }

        next();
    };
}