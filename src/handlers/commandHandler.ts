import {Client, REST, Routes} from "discord.js";
import {join} from "path";
import {readdirSync} from "fs";
import {SlashCommand} from "../types";

module.exports = async (client: Client) => {
    const body = [];
    let commandsDirs = join(__dirname, '../commands');

    readdirSync(commandsDirs).forEach(file => {
        if (!file.endsWith('.js')) return;

        const command: SlashCommand = require(`${commandsDirs}/${file}`).default;

        body.push(command.data.toJSON());
        client.commands.set(command.data.name, command);

        client.log.debug(`La commande ${command.data.name} est chargée (${commandsDirs}/${file})`, {"type": "Local Load", "file": __filename})
    });

    const rest = new REST({version: '10'}).setToken(process.env.DISCORD_TOKEN);

    try {
        await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {body: body});
        client.log.info(`Les commandes sont envoyées à Discord`, {"type": "Discord API Request", "file": __filename});
    } catch (error) {
        client.log.error(`Lors de l'envoie des commandes à discord : ${error}`, {"type": "Discord API Request", "file": __filename});
    }
}
