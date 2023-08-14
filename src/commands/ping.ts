import {SlashCommand} from "../types";
import {SlashCommandBuilder} from "discord.js";

const command: SlashCommand = {
    roles: [], //@everyone
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Test d'intéraction avec le bot"),
    execute: async (interaction) => {
        await interaction.reply('PONG !');
    }
}

export default command;
