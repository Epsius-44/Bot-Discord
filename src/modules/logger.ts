function dateToString(date: Date) :string {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

export class Logger {
    constructor() {}

    log(message: string) {
        console.log(`[LOG]-${dateToString(new Date())} :`,message);
    }

    info(message: string) {
        console.info(`[INFO]-${dateToString(new Date())} :`,message);
    }

    warn(message: string) {
        console.warn(`[WARN]-${dateToString(new Date())} :`,message);
    }

    error(message: string) {
        console.error(`[ERROR]-${dateToString(new Date())} :`,message);
    }

    debug(message: string) {
        console.debug(`[DEBUG]-${dateToString(new Date())} :`,message);
    }
}
