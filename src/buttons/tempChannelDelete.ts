import {ButtonActionMessage} from "../types";
import {checkPermission, discordReply} from "../modules/discordFunction";
import {PermissionsBitField} from "discord.js";

const command: ButtonActionMessage = {
    name: "tempChannelDelete",
    execute: async (interaction) => {
        //récupérer le message qui contient le bouton
        const message = await interaction.channel.messages.fetch(interaction.message.id);
        //récupérer l'utilisateur qui a interagi avec le bouton
        const user = await interaction.guild.members.fetch(interaction.user.id);
        const action = interaction.customId.split('_')[1];
        const channelId = interaction.customId.split('_')[2];
        //vérifier que l'utilisateur a la permission de gérer les salons
        if (!await checkPermission(interaction, user, PermissionsBitField.Flags.ManageChannels, "Vous n'avez pas l'autorisation de supprimer des salons")) return;
        //vérifier que le salon existe
        const channel = await interaction.guild.channels.fetch(channelId);
        if (!channel) {
            await discordReply(interaction, "Ce salon n'existe pas");
            return;
        }
        //vérifier que le salon est un salon temporaire à partir de l'id parent du salon
        if (channel.parentId !== process.env.CHANNEL_TEMP_CATEGORIE_ID) {
            await discordReply(interaction, "Ce salon n'est pas un salon temporaire");
            return;
        }

        const action_delete = action === "delete";
        //vérifier l'action
        const channel_name = channel.name;
        if (action_delete) {
            //supprimer le salon
            await channel.delete();
            await discordReply(interaction, "Le salon a été supprimé");
        }

        //modifier le message pour supprimer les boutons et afficher un message de confirmation "le salon a été supprimé"
        if (channel.id !== channelId) return;
        await message.edit({
            content: `${user} a ${action_delete ? 'validé':'refusé'} la demande de suppression du salon **${action_delete ? channel_name : channel}** le <t:${Math.floor(Date.now() / 1000)}>`,
            components: []
        });
    }
}

export default command;
