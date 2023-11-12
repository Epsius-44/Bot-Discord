import {SlashCommand} from "../types";
import {SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle} from "discord.js";

const command: SlashCommand = {
    roles: [process.env.ROLE_ADMIN_ID], //@root
    data: new SlashCommandBuilder()
        .setName('role_btn')
        .setDescription("Affiche les boutons pour choisir son rôle")
        // l'utilisateur doit avoir la permission de mute les membres pour utiliser cette commande
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        // la commande ne peut pas être utilisée en DM
        .setDMPermission(false),
    execute: async (interaction) => {
        const actionRow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("B3 ASRBD")
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(`role_asrbd`),
                new ButtonBuilder()
                    .setLabel("B3 CDA G1")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(`role_cda1`),
                new ButtonBuilder()
                    .setLabel("B3 CDA G2")
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(`role_cda2`),
                new ButtonBuilder()
                    .setLabel("B3 IA")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(`role_ia`),
                new ButtonBuilder()
                    .setLabel("B3 WIS")
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(`role_wis`)
            )

        await interaction.reply({content: "Choisissez votre classe pour avoir le role associé" ,components: [actionRow]});
    }
}

export default command;
