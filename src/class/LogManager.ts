import winston, { createLogger } from "winston";
import LokiTransport from "winston-loki";
import appMetadata from "../../package.json" with { type: "json" };
import { env } from "process";

/**
 * Gestionnaire de logs
 */
export default class LogManager {
  logger: winston.Logger;

  constructor() {
    this.logger = createLogger({
      level: process.env.LOG_LEVEL || "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.errors({ stack: true })
      ),
      defaultMeta: {
        status: null,
        category: null,
        metadata: null
      },
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(
              (info) => `[${info.timestamp}] ${info.level}: ${info.message}`
            ),
            winston.format.colorize({ all: true })
          )
        })
      ]
    });
    if (
      process.env.LZL_LOGS_AGGREGATOR_URL &&
      process.env.LZL_LOGS_AGGREGATOR_USER &&
      process.env.LZL_LOGS_AGGREGATOR_PASSWORD
    ) {
      this.logger.add(
        new LokiTransport({
          host: process.env.LZL_LOGS_AGGREGATOR_URL,
          basicAuth: `${process.env.LZL_LOGS_AGGREGATOR_USER}:${process.env.LZL_LOGS_AGGREGATOR_PASSWORD}`,
          labels: {
            app: appMetadata.name,
            version: appMetadata.version,
            instance:
              process.env.LZL_BOT_INSTANCE_NAME ||
              Math.random().toString(36).slice(2, 16),
            env: env.NODE_ENV || "development"
          },
          interval: 10,
          timeout: 30000,
          format: winston.format.json(),
          json: true,
          gracefulShutdown: true,
          clearOnError: true,
          onConnectionError(error) {
            console.error(`[ERROR] Loki Connection Fail : ${error}`);
          }
        })
      );
    }
  }
}
