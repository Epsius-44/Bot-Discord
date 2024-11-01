import { Collection } from "discord.js";
import { Db } from "mongodb";
import { Logger } from "./class/Logger";
import AppCommand from "./class/AppCommand";
import Button from "./class/Button";
import Modal from "./class/Modal";

// Variables d'environnement
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_PATH: string;
      BDD_CONNECTION: string;
      BDD_COLLECTION_CONFIG: string;
      BDD_COLLECTION_USERS: string;
      DISCORD_CLIENT_ID: string;
      DISCORD_TOKEN: string;
      HA_INSTANCE: string;
      LOGS_AGGREGATOR_URL: string;
      LOGS_AGGREGATOR_ENV: string;
      LOGS_AGGREGATOR_USER: string;
      LOGS_AGGREGATOR_PASSWORD: string;
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
    appButtons: Collection<string, Button>;
    appModals: Collection<string, Modal>;
    db: Db;
  }
}

// Sans cette ligne, le fichier ne sera pas pris en compte
export {};
