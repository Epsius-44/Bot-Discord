import { Client, Collection, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { readdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Handler from "./class/Handler";
import AppCommand from "./class/AppCommand";
import LogManager from "./class/LogManager.js";

// Chargement des variables d'environnement depuis le .env
dotenv.config();
// Définition du chemin de l'application
process.env.APP_PATH = path.dirname(fileURLToPath(import.meta.url));
// Initialisation du nom de l'instance du bot si non défini
if (!process.env.LZL_BOT_INSTANCE_NAME) {
  process.env.LZL_BOT_INSTANCE_NAME = Math.random().toString(36).slice(2, 16);
}

// Définition du client Discord avec ses intents (intents sont les permissions que le bot demande)
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.logManager = new LogManager();
client.appCommands = new Collection<string, AppCommand>();

client.logManager.logger.info("Chargement des gestionnaires...", {
  status: "starting",
  category: "handlers",
  timestamp: new Date().toISOString()
});

// Les gestionnaires sont des classes qui permettent de gérer les événements, les commandes, etc.
// Ils sont chargés dynamiquement depuis le dossier handlers
const handlerFiles: string[] = readdirSync(
  `${process.env.APP_PATH}/handlers`
).filter((file) => file.endsWith(".js") || file.endsWith(".ts"));
for (const file of handlerFiles) {
  const handler = (await import(`${process.env.APP_PATH}/handlers/${file}`))
    .default as Handler;
  client.logManager.logger.verbose(
    `Chargement du gestionnaire ${handler.name}`,
    {
      status: "starting",
      category: `handlers-${handler.name}`
    }
  );
  // Cette méthode est responsable de l'initialisation du gestionnaire
  // Par exemple, pour le gestionnaire d'événements, elle va charger tous les événements
  // et les enregistrer auprès du client Discord
  await handler.execute(client, handler.files);
  client.logManager.logger.debug(`Le gestionnaire ${handler.name} est chargé`, {
    status: "starting",
    category: `handlers-${handler.name}`
  });
}

// Connexion du client Discord
client.logManager.logger.verbose("Connexion du bot...", {
  status: "starting",
  category: "discord-login"
});
// Le token du bot est stocké dans les variables d'environnement
client.login(process.env.LZL_DISCORD_TOKEN || "");
