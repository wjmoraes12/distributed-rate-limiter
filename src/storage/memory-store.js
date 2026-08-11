import Storage from "../interfaces/Storage.js";

class MemoryStore extends Storage{
    constructor() {
        super();
        this.store = new Map();
    }

    get(key) {
        return this.store.get(key);
    }

    getAll() {
        return [...this.store.entries()].map(([key, bucket]) => ({
            key,
            ...bucket
        }));
    }

    set(key, value) {
        this.store.set(key, value);
        return value;
    }

    delete(key) {
        const deleted = this.store.delete(key);

        return{
            deleted,
            key
        }
    }

    updateBucket(key, data) {

    }

    deleteAll() {
        const totalBuckets = this.store.size;

        this.store.clear()

        return {
            deletedBuckets: totalBuckets,
            isEmpty: this.store.size === 0
        }
    }
}
export default MemoryStore;