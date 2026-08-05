export default class FakeBucketRepository {

    constructor() {
        this.buckets = new Map();
    }

    get(key) {
        return this.buckets.get(key);
    }

    getAll() {
        return [...this.buckets.values()];
    }

    save(key, bucket) {
        this.buckets.set(key, bucket);
    }

    delete(key) {
        return this.buckets.delete(key);
    }

    clear() {
        this.buckets.clear();
    }

}