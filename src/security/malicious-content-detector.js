class MaliciousContentDetector {

    constructor(rules = []) {
        this.rules = rules;
    }

    detect(content) {

        const matchedRules = this.rules.filter(
            rule => rule.matches(content)
        );

        if (matchedRules.length === 0) {
            return {
                suspicious: false,
                rules: []
            };
        }

        return {
            suspicious: true,
            rules: matchedRules.map(rule => ({
                reason: rule.getReason(),
                severity: rule.getSeverity()
            }))
        };
    }
}

export default MaliciousContentDetector;