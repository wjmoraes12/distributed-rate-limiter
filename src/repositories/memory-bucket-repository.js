import BucketRepository from "./bucket-repository.js";

class MemoryBucketRepository extends BucketRepository {

    constructor(storage) {
        super();
        this.storage = storage;
    }

    findByKey(key) {
        return this.storage.get(key);
    }

    findAll() {
        return this.storage.getAll();
    }

    save(key, bucket) {
        return this.storage.set(key, bucket);
    }

    remove(key) {
        return this.storage.delete(key);
    }

    removeAll() {
        return this.storage.deleteAll();
    }

}

export default MemoryBucketRepository;