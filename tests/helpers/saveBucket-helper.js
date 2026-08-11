import app from "../../src/app.js";

export default async function saveBucket(repository,bucket, key) {
    return repository.save(key,bucket);
}

