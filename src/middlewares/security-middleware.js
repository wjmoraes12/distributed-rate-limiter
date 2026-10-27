import SecurityProblemException from "../exceptions/security-problem-exception.js";

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

        logger.warn("Security problem was found");

        return next(new SecurityProblemException());
    };
};

export default securityMiddleware;