// Variables d'environnement
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      LZL_DISCORD_CLIENT_ID: string;
      LZL_DISCORD_TOKEN: string;
    }
  }
  type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
}

// Ajout de propriétés à l'objet Client de discord.js
declare module "discord.js" {
  export interface Client {
    appCommands: Collection<string, AppCommand>;
  }
}

// Sans cette ligne, le fichier ne sera pas pris en compte par l'IDE
// et les déclarations globales ne seront pas reconnues.
export {};
