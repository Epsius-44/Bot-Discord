import { Logger } from "./class/Logger";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_PATH: string;
      DISCORD_CLIENT_ID: string;
      DISCORD_TOKEN: string;
    }
  }
  type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
}

declare module "discord.js" {
  export interface Client {
    logger: Logger;
  }
}

export {};
