class Algorithm {

    consume(key) {
        throw new Error("Method consume() must be implemented");
    }

    getBucketByKey(key) {
        throw new Error("Method getBucket() must be implemented");
    }

    getAll() {
        throw new Error("Method getAll() must be implemented");
    }

    deleteAll(key) {
        throw new Error("Method deleteAll() must be implemented");
    }

    deleteBucketByKey() {
        throw new Error("Method deleteBucketByKey() must be implemented");
    }

}

export default Algorithm;