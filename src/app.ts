import { Client, Collection, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { readdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Handler from "./class/Handler";
import AppCommand from "./class/AppCommand";

// Chargement des variables d'environnement depuis le .env
dotenv.config();
// Définition du chemin de l'application
process.env.APP_PATH = path.dirname(fileURLToPath(import.meta.url));

// Définition du client Discord avec ses intents (intents sont les permissions que le bot demande)
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.appCommands = new Collection<string, AppCommand>();

console.info("start: Chargement des gestionnaires...");
// Les gestionnaires sont des classes qui permettent de gérer les événements, les commandes, etc.
// Ils sont chargés dynamiquement depuis le dossier handlers
const handlerFiles: string[] = readdirSync(
  `${process.env.APP_PATH}/handlers`
).filter((file) => file.endsWith(".js") || file.endsWith(".ts"));
for (const file of handlerFiles) {
  const handler = (await import(`${process.env.APP_PATH}/handlers/${file}`))
    .default as Handler;
  console.debug(`start: Chargement du gestionnaire ${handler.name}`);
  // Cette méthode est responsable de l'initialisation du gestionnaire
  // Par exemple, pour le gestionnaire d'événements, elle va charger tous les événements
  // et les enregistrer auprès du client Discord
  await handler.execute(client, handler.files);
  console.debug(`start: Le gestionnaire ${handler.name} est chargé`);
}

// Connexion du client Discord
console.info("start: Connexion du bot...");
// Le token du bot est stocké dans les variables d'environnement
client.login(process.env.LZL_DISCORD_TOKEN || "");
