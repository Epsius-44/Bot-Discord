import LogManager from "./class/LogManager";
// Variables d'environnement
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      LOG_LEVEL:
        | "silly"
        | "debug"
        | "verbose"
        | "http"
        | "info"
        | "warn"
        | "error";
      APP_PATH: string;
      LZL_BOT_INSTANCE_NAME: string;
      LZL_DISCORD_CLIENT_ID: string;
      LZL_DISCORD_TOKEN: string;
      LZL_LOGS_AGGREGATOR_URL: string;
      LZL_LOGS_AGGREGATOR_USER: string;
      LZL_LOGS_AGGREGATOR_PASSWORD: string;
      NODE_ENV: "development" | "production" | "test";
    }
  }
  type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
}

// Ajout de propriétés à l'objet Client de discord.js
declare module "discord.js" {
  export interface Client {
    appCommands: Collection<string, AppCommand>;
    logManager: LogManager;
  }
}

// Sans cette ligne, le fichier ne sera pas pris en compte par l'IDE
// et les déclarations globales ne seront pas reconnues.
export {};
