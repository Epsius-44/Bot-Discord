/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Client, Collection, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";
import { readdirSync } from "fs";
import Handler from "./class/Handler";
import path from "path";
import { fileURLToPath } from "url";
import { Logger } from "./class/Logger.js";
import AppCommand from "./class/AppCommand.js";

// Charge les variables d'environnement depuis le .env
dotenv.config();
process.env.APP_PATH = path.dirname(fileURLToPath(import.meta.url));

// Configuration du client Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildVoiceStates
  ]
});
client.logger = new Logger();
client.appCommands = new Collection<string, AppCommand>();

// Chargement des gestionnaires (commandes, événements, etc.)
client.logger.info("handler - Début du chargement des gestionnaires");
const handlerFiles: string[] = readdirSync(
  `${process.env.APP_PATH}/handlers`
).filter((file) => file.endsWith(".js") || file.endsWith(".ts"));
for (const file of handlerFiles) {
  const handler = (await import(`${process.env.APP_PATH}/handlers/${file}`))
    .default as Handler;
  client.logger.debug(`handler - Chargement du gestionnaire ${file}`);
  await handler.execute(client, handler.files);
  client.logger.debug(`handler - Le gestionnaire ${file} est chargé`);
}
client.logger.info("handler - Fin du chargement des gestionnaires");

// Établissement de la connexion avec Discord
await client.login(process.env.DISCORD_TOKEN);
