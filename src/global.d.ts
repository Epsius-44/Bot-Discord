import LogManager from "./class/LogManager";
// Variables d'environnement
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Variables génériques
      LOG_LEVEL:
        | "silly"
        | "debug"
        | "verbose"
        | "http"
        | "info"
        | "warn"
        | "error";
      APP_PATH: string;
      NODE_ENV: "development" | "production" | "test";
      // Variables spécifiques au bot
      LZL_BOT_INSTANCE_NAME: string;
      LZL_BOT_CONFIG_ROLE_ADMIN: string;
      LZL_BOT_CONFIG_ROLE_MODERATOR: string;
      LZL_BOT_CONFIG_ROLE_TEACHER: string;
      LZL_BOT_CONFIG_CATEGORY_TMPCHANNELS: string;
      LZL_BOT_CONFIG_CATEGORY_ARCHIVE: string;
      // Variables spécifiques aux services externes
      LZL_DISCORD_CLIENT_ID: string;
      LZL_DISCORD_TOKEN: string;
      LZL_LOGS_AGGREGATOR_URL: string;
      LZL_LOGS_AGGREGATOR_USER: string;
      LZL_LOGS_AGGREGATOR_PASSWORD: string;
    }
  }
  type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
}

// Ajout de propriétés à l'objet Client de discord.js
declare module "discord.js" {
  export interface Client {
    appCommands: Collection<string, AppCommand>;
    modals: Collection<string, Modal>;
    logManager: LogManager;
  }
}

// Sans cette ligne, le fichier ne sera pas pris en compte par l'IDE
// et les déclarations globales ne seront pas reconnues.
export {};
