import { Collection } from "discord.js";
import { Logger } from "./class/Logger";
import AppCommand from "./class/AppCommand";

// Variables d'environnement
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_PATH: string;
      DISCORD_CLIENT_ID: string;
      DISCORD_TOKEN: string;
      ROLE_ADMIN_ID: string;
    }
  }
  type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
}

// Ajout de propriétés à l'objet Client de discord.js
declare module "discord.js" {
  export interface Client {
    logger: Logger;
    appCommands: Collection<string, AppCommand>;
  }
}

// Sans cette ligne, le fichier ne sera pas pris en compte
export {};
