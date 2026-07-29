class Logger {

    info(message, metadata = {}) {
        this.log("INFO", message, metadata);
    }

    warn(message, metadata = {}) {
        this.log("WARN", message, metadata);
    }

    error(message, metadata = {}) {
        this.log("ERROR", message, metadata);
    }

    debug(message, metadata = {}) {
        this.log("DEBUG", message, metadata);
    }

    log(level, message, metadata) {

        const log = {
            timestamp: new Date().toISOString(),
            level,
            message,
            ...metadata
        };

        console.log(JSON.stringify(log));
    }

}

export default Logger;