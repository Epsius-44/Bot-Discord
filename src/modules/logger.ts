import {Logtail} from "@logtail/node";
import {Context} from "@logtail/types";

function dateToString(date: Date) :string {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

export class Logger {
    logtail: Logtail | null;

    constructor(t: string) {
        t
            ? this.logtail = new Logtail(t)
            : this.logtail = null;
    }

    log(message: string, context?: Context) {
        this.logtail
            ? this.logtail.log(message, "log", context)
            : console.log(`[LOG]-${dateToString(new Date())} :`,message, console);
    }

    info(message: string, context?: Context) {
        this.logtail
            ? this.logtail.info(message, context)
            : console.info(`[INFO]-${dateToString(new Date())} :`,message, console);
    }

    warn(message: string, context?: Context) {
        this.logtail
            ? this.logtail.warn(message, context)
            : console.warn(`[WARN]-${dateToString(new Date())} :`,message, console);
    }

    error(message: string, context?: Context) {
        this.logtail
            ? this.logtail.error(message, context)
            : console.error(`[ERROR]-${dateToString(new Date())} :`,message, console);
    }

    debug(message: string, context?: Context) {
        this.logtail
            ? this.logtail.debug(message, context)
            : console.debug(`[DEBUG]-${dateToString(new Date())} :`,message, console);
    }
}
