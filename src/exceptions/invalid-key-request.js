class InvalidKeyRequest extends Error{

    constructor(){

        super(`Invalid key`);

        this.name = "InvalidKeyRequest";

    }

}

export default InvalidKeyRequest;