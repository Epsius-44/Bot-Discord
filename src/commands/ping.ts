import {SlashCommand} from "../types";
import {SlashCommandBuilder, PermissionFlagsBits} from "discord.js";

const command: SlashCommand = {
    roles: [], //@everyone
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Test d'intéraction avec le bot")
        // l'utilisateur doit avoir la permission de mute les membres pour utiliser cette commande
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        // la commande ne peut pas être utilisée en DM
        .setDMPermission(false),
    execute: async (interaction) => {
        await interaction.reply('PONG !');
    }
}

export default command;
