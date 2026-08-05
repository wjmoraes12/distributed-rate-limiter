export default class FakeLogger {

    constructor() {
        this.logs = [];
    }

    info(message, data) {
        this.logs.push({
            level: "info",
            message,
            data
        });
    }

    error(message, data) {
        this.logs.push({
            level: "error",
            message,
            data
        });
    }

}