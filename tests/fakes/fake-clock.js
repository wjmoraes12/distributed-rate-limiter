export default class FakeClock {

    constructor(start = 0) {
        this.currentTime = start;
    }

    now() {
        return this.currentTime;
    }

    advance(milliseconds) {
        this.currentTime += milliseconds;
    }

}