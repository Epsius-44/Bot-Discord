import {SlashCommand} from "../types";
import {SlashCommandBuilder, PermissionFlagsBits} from "discord.js";

const command: SlashCommand = {
    roles: [process.env.ROLE_ADMIN_ID], //@root
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Test d'intéraction avec le bot")
        // l'utilisateur doit avoir la permission de mute les membres pour utiliser cette commande
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        // la commande ne peut pas être utilisée en DM
        .setDMPermission(false),
    execute: async (interaction) => {
        await interaction.reply({
                content: `Version du bot : ${require('../../package.json').version}`,
                ephemeral: true
            });
    }
}

export default command;
