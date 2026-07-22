class BucketNotFoundException extends Error{

    constructor(key){

        super(`Bucket ${key} not found`);

        this.name = "BucketNotFoundException";

    }

}

export default BucketNotFoundException;