import MemoryRepository from "../../src/repositories/memory-bucket-repository.js"
import MemoryStore from "../../src/storage/memory-store.js";
import config from "../../src/config/rate-limiter-config.js";
import TokenBucketAlgorithm from "../../src/algorithms/token-bucket-algorithm.js";
import FakeClock from "../fakes/fake-clock.js";

export default function makeAlgorithm() {
    const clock = new FakeClock()
    const store = new MemoryStore();
    const repository = new MemoryRepository(store);
    return {
        algorithm: new TokenBucketAlgorithm(
            clock,
            repository,
            config
        ),
        clock
    };}