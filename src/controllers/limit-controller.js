import rateLimiterService from "../services/rateLimiter-service.js";

class LimitController {

    health(req, res) {
        return res.json({
            message: "Rate limiter is running"
        });
    }


    getAll(req, res) {    
        return res.json(rateLimiterService.getAll());
    }

    getBucketByKey(req, res) {   
        const {id} = req.params;
        try {
            const bucket = rateLimiterService.getBucketByKey(id)

            if(!bucket){
                return res.status(404).json({
                    message: "Bucket not found"
                });
            }

            return res.json({
                message: "Bucket found",
                bucket: bucket
            });
        } catch (error) {
            return this.messageInternalError(res)
        }
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
            return this.messageInternalError(res)
        }
    }

    async deleteAllBuckets(req, res){
        try {
            const result = await rateLimiterService.deleteAll();

            if(!result.isEmpty){
                return this.messageIsNotDeleted(res)
            }

            return res.json({
                message:"Todos os Buckets foram deletados!",
                status: true
            })

        } catch (error) {
            return this.messageInternalError(res)
        }
    }

    async deleteBucketById(req, res){
        const {id} = req.params;
        try {
            const result = await rateLimiterService.deleteBucketByKey(id);

            if(!result.deleted){
                return this.messageIsNotDeleted(res)
            }

            return res.json({
                message:`Buckets ${id} foi deletado!`,
                status: true
            })
            
        } catch (error) {
            return this.messageInternalError(res)
        }
    }

    //Métodos Auxiliares
    messageIsNotDeleted(res){
        return res.json({
            message: "Não foi possível deletar!",
            status: false
        })
    }

    messageInternalError(res){
        return res.status(500).json({
            message:"Erro interno ao Deletar os Buckets",
            status: false
        })
    }

    getClientKey(req){
        return req.ip.replace(`::ffff:`,``)
    }
}
export default new LimitController();