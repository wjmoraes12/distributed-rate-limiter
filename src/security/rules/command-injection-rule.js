import SecurityRule from "./security-rule.js";

class CommandInjectionRule extends SecurityRule {

    matches(content) {

        if (typeof content !== "string") {
            return false;
        }

        const patterns = [
            /;\s*(rm|cat|curl|wget)\b/i,
            /\|\s*(sh|bash|cmd|powershell)\b/i
        ];

        return patterns.some(pattern =>
            pattern.test(content)
        );
    }

    getReason() {
        return "Possible command injection";
    }

    getSeverity() {
        return "high";
    }
}

export default CommandInjectionRule;