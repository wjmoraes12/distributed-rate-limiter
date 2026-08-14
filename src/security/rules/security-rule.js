class SecurityRule {

    matches(content) {
        throw new Error("matches() must be implemented");
    }

    getReason() {
        throw new Error("getReason() must be implemented");
    }

    getSeverity() {
        throw new Error("getSeverity() must be implemented");
    }
}
export default SecurityRule;