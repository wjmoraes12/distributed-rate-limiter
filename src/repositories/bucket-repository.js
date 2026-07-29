class BucketRepository {

    constructor() {
        if (new.target === BucketRepository) {
            throw new Error("BucketRepository is an abstract class.");
        }
    }

    findByKey(key) {
        throw new Error("Method findByKey() must be implemented.");
    }

    findAll() {
        throw new Error("Method findAll() must be implemented.");
    }

    save(key, bucket) {
        throw new Error("Method save() must be implemented.");
    }

    remove(key) {
        throw new Error("Method remove() must be implemented.");
    }

    removeAll() {
        throw new Error("Method removeAll() must be implemented.");
    }

}

export default BucketRepository;