import MaliciousContentDetector from "../security/malicious-content-detector.js";

import SqlInjectionRule from "../security/rules/sql-injection-rule.js";

import CommandInjectionRule from "../security/rules/command-injection-rule.js";

import SuspiciousLengthRule from "../security/rules/suspicious-length-rule.js";

import securityMiddleware from "../middlewares/security-middleware.js";

import Logger from "../logger/logger.js";
const logger = new Logger();

const sqlInjectionRule = new SqlInjectionRule();
const commandInjectionRule = new CommandInjectionRule();
const suspiciousLengthRule = new SuspiciousLengthRule(100);

const maliciousContentDetector =
    new MaliciousContentDetector([
        sqlInjectionRule,
        commandInjectionRule,
        suspiciousLengthRule
    ]);


const security =
    securityMiddleware(
        maliciousContentDetector, logger
    );


export {
    security
};