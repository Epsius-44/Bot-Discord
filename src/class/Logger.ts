function dateToString(date: Date): string {
  return `${date.toISOString()}`;
}

export class Logger {
  log(message: string): void {
    console.log(`[LOG]   ${dateToString(new Date())} : ${message}`);
  }
  info(message: string): void {
    console.info(`[INFO]  ${dateToString(new Date())} : ${message}`);
  }
  warn(message: string): void {
    console.warn(`[WARN]  ${dateToString(new Date())} : ${message}`);
  }
  error(message: string): void {
    console.error(`[ERROR] ${dateToString(new Date())} : ${message}`);
  }
  debug(message: string): void {
    console.debug(`[DEBUG] ${dateToString(new Date())} : ${message}`);
  }
}
