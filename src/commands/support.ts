import {SlashCommand} from "../types";
import {supportType} from "../modules/constant";
import {
    SlashCommandBuilder, PermissionFlagsBits,
    ModalBuilder, ActionRowBuilder, TextInputBuilder,TextInputStyle
} from "discord.js";

const command: SlashCommand = {
    roles: [process.env.ROLE_ADMIN_ID], //@root
    data: new SlashCommandBuilder()
        .setName('support')
        .setDescription("Demander de l'aide ou proposer une suggestion")
        .addStringOption(option => option
            .setName('type')
            .setDescription("Type de demande")
            .setRequired(true)
            .addChoices(
                ...supportType
            )
        )
        // l'utilisateur doit avoir la permission de mute les membres pour utiliser cette commande
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        // la commande ne peut pas être utilisée en DM
        .setDMPermission(false),
    execute: async (interaction) => {
        //récupération du type de demande
        const type = interaction.options.get('type')
        const typeText = type.value === "help" ? "demande d'aide" : type.value
        const modal = new ModalBuilder()
            .setTitle(`Support`)
            .setCustomId(`support_${type.value}`)

        const title = new TextInputBuilder()
            .setCustomId("titleSupport")
            .setLabel(`Titre de la ${typeText}`)
            .setStyle(TextInputStyle.Short)
            .setMinLength(10)
            .setMaxLength(100)
            .setRequired(true)

        const paragraph = new TextInputBuilder()
            .setCustomId("paragraphSupport")
            .setLabel(`Description de la ${typeText}`)
            .setStyle(TextInputStyle.Paragraph)
            .setMinLength(25)
            .setMaxLength(4000)
            .setRequired(true)

        modal.addComponents(new ActionRowBuilder().addComponents(title) as ActionRowBuilder<TextInputBuilder>)
        modal.addComponents(new ActionRowBuilder().addComponents(paragraph) as ActionRowBuilder<TextInputBuilder>)

        await interaction.showModal(modal)

    }
}

export default command;
