class MemoryStore {
    constructor() {
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

    has(key) {
        return this.store.has(key);
    }

    delete(key) {
        const deleted = this.store.delete(key);

        return{
            deleted,
            key
        }
    }

    updatedBucket(key, data) {

        const bucket = this.store.get(key);
        if (!bucket) {
            return null;
        }
    
        const updatedBucket = {
            ...bucket,
            ...data
        };
    
        this.store.set(key, updatedBucket);
    
        return updatedBucket;
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
export default new MemoryStore();