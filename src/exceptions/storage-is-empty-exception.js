class StorageIsEmptyException extends Error {

    constructor(retryAfter) {
        super("Storage Empty");

        this.name = "StorageIsEmptyException";
    }

}
export default StorageIsEmptyException;