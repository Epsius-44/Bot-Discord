// Import
import {Client, Collection, GatewayIntentBits} from "discord.js";
import * as dotenv from "dotenv";
import {join} from "path";
import {readdirSync} from "fs";
import {SlashCommand} from "./types";
import {Logger} from "./modules/logger";

// Load env var
dotenv.config();
dotenv.config({ path: ".env.local", override: true });

// Setup client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.slashCommands = new Collection<string, SlashCommand>();
client.log = new Logger(process.env.LOGTAIL_TOKEN);

const handlersDirs = join(__dirname, "./handlers");

readdirSync(handlersDirs).forEach(file => {
    require(`${handlersDirs}/${file}`)(client);
})

// Login client to Discord
client.login(process.env.DISCORD_TOKEN);

