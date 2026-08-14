import SecurityRule from "./security-rule.js";

class SqlInjectionRule extends SecurityRule {

    matches(content) {

        if (typeof content !== "string") {
            return false;
        }

        const patterns = [
            /'\s*or\s+/i,
            /\bunion\s+select\b/i,
            /\bdrop\s+table\b/i
        ];

        return patterns.some(pattern =>
            pattern.test(content)
        );
    }

    getReason() {
        return "Possible SQL injection";
    }

    getSeverity() {
        return "high";
    }
}

export default SqlInjectionRule;