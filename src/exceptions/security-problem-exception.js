class SecurityProblemException extends Error {

    constructor() {
        super("Security problem was found");

        this.name = "SecurityProblemException";
    }

}
export default SecurityProblemException;