// Import
import {Client, Collection, GatewayIntentBits} from "discord.js";
import * as dotenv from "dotenv";
import {join} from "path";
import {readdirSync} from "fs";
import {ButtonActionMessage, Modal, SlashCommand, AppCommand} from "./types";
import {Logger} from "./modules/logger";

// Load env var
dotenv.config();
dotenv.config({ path: ".env.local", override: true });

// Setup client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildModeration,
    ]
});

client.commands = new Collection<string, SlashCommand | AppCommand>();
client.buttons = new Collection<string, ButtonActionMessage>();
client.modals = new Collection<string, Modal>();
client.log = new Logger(process.env.LOGTAIL_TOKEN);

const handlersDirs = join(__dirname, "./handlers");

readdirSync(handlersDirs).forEach(file => {
    require(`${handlersDirs}/${file}`)(client);
})

// Login client to Discord
client.login(process.env.DISCORD_TOKEN);

