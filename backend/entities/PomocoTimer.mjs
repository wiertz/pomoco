import { EventEmitter } from 'node:events'

class PomocoTimer {
    constructor(periods) {
        this.periods = periods
        this.periodIdx = 0
        this.remaining = periods[this.periodIdx].duration
        this.interval = null

        // event emitter for finish event
        this.events = new EventEmitter()
    }
    isRunning() {
        // returns true if interval is set
        return !!this.interval
    }
    start() {
        // only start if there is remaining time
        if (this.remaining == 0) return

        this.stop()
        this.interval = setInterval(() => {
            this.remaining--
            if(this.remaining == 0) {
                this.stop()
                this.events.emit('finished')
            }
            if(this.remaining % 10 == 0) {
                // send every 10 seconds to keep in sync
                this.events.emit('update')
            }
        }, 1000)
    }
    stop() {
        if(this.interval) {
            clearInterval(this.interval)
            this.interval = null
        }
    }
    nextPeriod() {
        this.stop()
        this.periodIdx = (this.periodIdx + 1) % this.periods.length
        this.remaining = this.periods[this.periodIdx].duration
    }
    getStatus() {
        return {
            description: this.periods[this.periodIdx].description,
            remaining: this.remaining,
            isRunning: this.isRunning(),
            timestamp: Date.now()
        }
    }
}

export { PomocoTimer }