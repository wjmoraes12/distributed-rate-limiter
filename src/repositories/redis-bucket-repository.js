import BucketRepository from "../interfaces/BucketRepository.js";
import Bucket from "../entities/Bucket.js";


export default class RedisBucketRepository extends BucketRepository {
    constructor(storage) {
        super();
        this.storage = storage;
    }

    async findByKey(key) {
        const data = await this.storage.get(key);

        if (!data) {
            return null;
        }
        return new Bucket(data.tokens, data.updatedAt);
    }

    async findAll() {
        return await this.storage.getAll();
    }

    async save(key, bucket) {
        await this.storage.set(key, {
            tokens: bucket.tokens,
            updatedAt: bucket.updatedAt
        });
        
        return bucket;
    }

    async remove(key) {
        return await this.storage.delete(key);
    }

    async removeAll() {
        return await this.storage.deleteAll();
    }
}