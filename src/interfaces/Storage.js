class Storage {

    constructor() {

        if (new.target === Storage) {
            throw new Error("Storage is an abstract class.");
        }

    }

    get() {
        throw new Error("Method get() must be implemented.");
    }

    set() {
        throw new Error("Method set() must be implemented.");
    }

    getAll() {
        throw new Error("Method getAll() must be implemented.");
    }

    delete() {
        throw new Error("Method delete() must be implemented.");
    }

    updateBucket() {
        throw new Error("Method updateBucket() must be implemented.");
    }

    deleteAll() {
        throw new Error("Method deleteAll() must be implemented.");
    }

}

export default Storage;