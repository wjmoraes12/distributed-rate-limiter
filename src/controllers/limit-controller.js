import rateLimiterService from "../services/rateLimiter-service.js";

class LimitController {

    health(req, res) {
        return res.json({
            message: "Rate limiter is running"
        });
    }

    async consume(req, res) {
        const key = req.ip.replace("::ffff:", "");

        const result = await rateLimiterService.consume(key);
        if (!result.allowed) {
            return res.status(429).json({
                message: "Muitas requisições. Tente novamente mais tarde.",
                retryAfter: result.retryAfter
            });
        }

        return res.json({
            message: "Requisição permitida",
            tokens: result.tokens
        });
    }

    async getBucket(req, res) {
        const key = req.ip.replace("::ffff:", "");

        const bucket = await rateLimiterService.getBucket(key);

        return res.json(bucket);
    }

    async reset(req, res) {
        const key = req.ip.replace("::ffff:", "");

        const result = await rateLimiterService.reset(key);

        return res.json(result);
    }

    async resetAll(req, res) {
        const result = await rateLimiterService.resetAll();

        return res.json(result);
    }
}

export default new LimitController();