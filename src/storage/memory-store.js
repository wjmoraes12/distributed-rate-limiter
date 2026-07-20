class MemoryStore {
    constructor() {
        this.store = new Map();
    }

    get(key) {
        return this.store.get(key);
    }

    getAll() {
        return [...this.store.values()];
    }

    set(key, value) {
        this.store.set(key, value);
        return value;
    }

    has(key) {
        return this.store.has(key);
    }

    delete(key) {
        return this.store.delete(key);
    }

    clear() {
        this.store.clear();
    }
}
export default new MemoryStore();