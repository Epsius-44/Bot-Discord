import { Client, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";

// Charge les variables d'environnement depuis le .env
dotenv.config();

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

// Établissement de la connexion avec Discord
await client.login(process.env.DISCORD_TOKEN);
