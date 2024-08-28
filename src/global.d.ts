import { Collection } from "discord.js";
import { Logger } from "./class/Logger";
import AppCommand from "./class/AppCommand";

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
    appCommands: Collection<string, AppCommand>;
  }
}

export {};
