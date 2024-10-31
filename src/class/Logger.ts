import LokiTransport from "winston-loki";
import appMetadata from "../../package.json" with { type: "json" };
import winston, { createLogger, format, transports } from "winston";

export class Logger {
  logger: winston.Logger;

  constructor() {
    if (!process.env.LOGS_AGGREGATOR_URL) {
      this.logger = createLogger({
        level: "debug",
        defaultMeta: {
          version: appMetadata.version
        },
        format: format.combine(
          format.timestamp(),
          format.printf(
            (info) =>
              `[${info.timestamp}] ${info.level}: ${info.labels.job} - ${info.message}`
          ),
          format.colorize({ all: true })
        ),
        transports: [new transports.Console()]
      });
    } else {
      this.logger = createLogger({
        level: "debug",
        defaultMeta: {
          version: appMetadata.version
        },
        format: format.combine(
          format.timestamp(),
          format.json(),
          format.errors({ stack: true })
        ),
        transports: [
          new transports.Console({
            format: format.combine(
              format.timestamp(),
              format.printf(
                (info) =>
                  `[${info.timestamp}] ${info.level}: ${info.labels.job} - ${info.message}`
              ),
              format.colorize({ all: true })
            )
          }),
          new LokiTransport({
            host: process.env.LOGS_AGGREGATOR_URL,
            basicAuth: `${process.env.LOGS_AGGREGATOR_USER}:${process.env.LOGS_AGGREGATOR_PASSWORD}`,
            interval: 10,
            timeout: 30000,
            json: true,
            labels: {
              env: process.env.LOGS_AGGREGATOR_ENV,
              instance: process.env.HA_INSTANCE,
              service_name: "bot-discord",
              job: "unhandled"
            },
            gracefulShutdown: true,
            clearOnError: true,
            onConnectionError(error) {
              console.error(`[ERROR] Loki Connection Fail : ${error}`);
            }
          })
        ]
      });
    }
  }

  log(message: string, ...meta: any[]): void {
    this.logger.http(message, ...meta);
  }
  info(message: string, ...meta: any[]): void {
    this.logger.info(message, ...meta);
  }
  warn(message: string, ...meta: any[]): void {
    this.logger.warn(message, ...meta);
  }
  error(message: string, ...meta: any[]): void {
    this.logger.error(message, ...meta);
  }
  debug(message: string, ...meta: any[]): void {
    this.logger.debug(message, ...meta);
  }
}
