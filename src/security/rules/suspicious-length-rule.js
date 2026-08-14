import SecurityRule from "./security-rule.js";

class SuspiciousLengthRule extends SecurityRule {

    constructor(maxLength = 100) {
        super();

        this.maxLength = maxLength;
    }

    matches(content) {

        if (typeof content !== "string") {
            return false;
        }

        return content.length > this.maxLength;
    }

    getReason() {
        return "Suspiciously long input";
    }

    getSeverity() {
        return "medium";
    }
}

export default SuspiciousLengthRule;