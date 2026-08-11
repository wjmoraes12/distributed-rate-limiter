import MemoryBucketRepository from "../../src/repositories/memory-bucket-repository.js";
import MemoryStore from "../../src/storage/memory-store.js";
import Bucket from "../../src/entities/Bucket.js";

export default function makeMemoryBucketRepository() {

    const store = new MemoryStore();
    const repository = new MemoryBucketRepository(store);
    return repository;
}