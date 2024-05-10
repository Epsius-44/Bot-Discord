// Import
import {Client, Collection, IntentsBitField} from "discord.js";
import * as dotenv from "dotenv";
import {join} from "path";
import {readdirSync} from "fs";
import {SlashCommand} from "./types";
import {Logger} from "./modules/logger";
import {ActiveHa} from "./modules/active-ha";

// Load env var
dotenv.config();
dotenv.config({ path: ".env.local", override: true });

// Setup client
const myIntents = new IntentsBitField();
myIntents.add(
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent
);
const client = new Client({
    intents: myIntents
});

client.slashCommands = new Collection<string, SlashCommand>();
client.log = new Logger();
client.activeHa = new ActiveHa(client);

const handlersDirs = join(__dirname, "./handlers");

readdirSync(handlersDirs).forEach(file => {
    require(`${handlersDirs}/${file}`)(client);
})

// Login client to Discord
client.login(process.env.DISCORD_TOKEN);
