export default function createLoggerMiddleware(logger) {

    return function loggerMiddleware(req, res, next) {

        const start = Date.now();

        const clientIp = req.ip.replace("::ffff:", "");

        res.on("finish", () => {

            logger.info("HTTP Request", {
                method: req.method,
                path: req.originalUrl,
                status: res.statusCode,
                durationMs: Date.now() - start,
                ip: clientIp
            });

        });

        next();

    };

}