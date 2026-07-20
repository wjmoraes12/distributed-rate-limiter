import rateLimiterService from "../services/rateLimiter-service.js";

class LimitController {

    health(req, res) {
        return res.json({
            message: "Rate limiter is running"
        });
    }

    getClientKey(req){
        return req.ip.replace(`::ffff:`,``)
    }

    async getAll(req, res) {
        const buckets = await rateLimiterService.getAll();
    
        return res.json(buckets);
    }

    async consume(req, res) {
        try{
            const key = this.getClientKey(req)
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

        }catch(error){

            return res.status(500).json({
                message: "Internal Server Error"
            });
        }
    }

    
}
export default new LimitController();