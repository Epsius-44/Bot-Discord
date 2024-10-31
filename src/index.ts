import { Client, Collection, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";
import { readdirSync } from "fs";
import Handler from "./class/Handler";
import path from "path";
import { fileURLToPath } from "url";
import { Logger } from "./class/Logger.js";
import AppCommand from "./class/AppCommand.js";
import { MongoClient } from "mongodb";
import Button from "./class/Button";
import Modal from "./class/Modal";

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
client.appButtons = new Collection<string, Button>();
client.appModals = new Collection<string, Modal>();

// Ouverture de la connexion BDD
client.logger.info("Ouverture de la connexion avec MongoDB", {
  labels: { job: "start" }
});
try {
  const mongo = await MongoClient.connect(process.env.BDD_CONNECTION);
  await mongo.connect();
  client.db = mongo.db();
  client.logger.info("Connexion établie avec MongoDB", {
    labels: { job: "start" }
  });
} catch (error: any) {
  error.message = `Erreur lors de la connexion avec MongoDB : ${error.message}`;
  client.logger.error(error, { labels: { job: "start" } });
}

// Chargement des gestionnaires (commandes, événements, etc.)
client.logger.info("Début du chargement des gestionnaires", {
  labels: { job: "start" }
});
const handlerFiles: string[] = readdirSync(
  `${process.env.APP_PATH}/handlers`
).filter((file) => file.endsWith(".js") || file.endsWith(".ts"));
for (const file of handlerFiles) {
  const handler = (await import(`${process.env.APP_PATH}/handlers/${file}`))
    .default as Handler;
  client.logger.debug(`Chargement du gestionnaire ${file}`, {
    labels: { job: "start" }
  });
  await handler.execute(client, handler.files);
  client.logger.debug(`Le gestionnaire ${file} est chargé`, {
    labels: { job: "start" }
  });
}
client.logger.info("Fin du chargement des gestionnaires", {
  labels: { job: "start" }
});

// Gestion des erreurs
process.on("uncaughtException", (error: any) => {
  error.message = `Erreur non capturée : ${error.message}`;
  client.logger.error(error, { labels: { job: "unhandled" } });
});
process.on("unhandledRejection", (reason: any) => {
  client.logger.error(`Rejet non capturé : ${reason}`, {
    labels: { job: "unhandled" }
  });
});
process.on("exit", (code) => {
  client.logger.warn(`Le processus s'est arrêté avec un code ${code}`, {
    labels: { job: "unhandled" }
  });
});

// Établissement de la connexion avec Discord
await client.login(process.env.DISCORD_TOKEN);
