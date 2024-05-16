function dateToString(date: Date): string {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

export class Logger {
    constructor() {}

    log(message: string): void {
        console.log(`[LOG] ${dateToString(new Date())} : ${message}`)
    }
    info(message: string): void {
        console.log(`[INFO] ${dateToString(new Date())} : ${message}`)
    }
    warn(message: string): void {
        console.log(`[WARN] ${dateToString(new Date())} : ${message}`)
    }
    error(message: string): void {
        console.log(`[ERROR] ${dateToString(new Date())} : ${message}`)
    }
    debug(message: string): void {
        console.log(`[DEBUG] ${dateToString(new Date())} : ${message}`)
    }
}
