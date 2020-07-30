let chalk = require('chalk'),
    fs = require('fs'),
    Path = require('path'),
    timestamp = require('time-stamp');

class Logger {
    /**
     * Custom logger. Taken from my project [mangium](https://github.com/mangium/mangioum)
     */
    constructor() {
        this.last = Date.now();
    }

    /**
     * @param {String} messages
     */
    info(...messages) {
        this.log("info", messages);
    }

    /**
     * @param {String} messages
     */
    warn(...messages) {
        this.log("warn", messages);
    }

    /**
     * @param {String} messages
     */
    err(...messages) {
        this.log("error", messages);
    }

    /**
     * @param {String} messages
     */
    fatal(...messages) {
        this.log("fatal", messages);
    }

    /**
     * @param {String} type
     * @param {String[]} messages
     */
    log(type, messages) {
        let sts = "";
        switch(type) {
            case "info":
                sts = chalk`{blue info}`;
                break;
            case "error":
                sts = chalk`{red error}`;
                break;
            case "fatal":
                sts = chalk`{red.bold FATAL}`;
                break;
            case "warn":
                sts = chalk`{yellow warn}`;
                break;
            default:
                sts = chalk`{blue info}`;
                break;
        }
        let newer = Date.now();
        let message = chalk`{blue ${timestamp("HH:mm.ss")}} ${sts} ${type === "error" || type === "fatal" ? chalk`{red ${messages.join(" ")}}` : messages.join(" ")} {cyan +${newer - this.last}ms}`;
        console.log(message);
        this.last = newer;
    }
}

module.exports = Logger;
