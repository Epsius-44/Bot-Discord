import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    CommandInteraction,
    EmbedBuilder,
    GuildMember,
    TextChannel,
} from "discord.js";
import {discordReply} from "../../modules/discordFunction";

export default async function deleteTempChannel(
    interaction: CommandInteraction,
    channel_select: TextChannel,
    member: GuildMember,

){
    const reason = interaction.options.get('raison');

    const log_channel = await interaction.guild?.channels.fetch(process.env.CHANNEL_LOG_ID) as TextChannel;

    //vérifier si l'utilisateur a le rôle de modérateur ou d'administrateur
    if (member.roles.cache.has(process.env.ROLE_ADMIN_ID)) {
        //si oui, supprimer le salon
        await channel_select.delete(`Suppression du salon temporaire via la commande /temp_channel delete par ${member.user.username} (${member.user.globalName})`)
        //si le salon supprimé est le même que celui dans lequel la commande a été utilisée, ne pas envoyer de message
        if (channel_select.id !== interaction.channelId) {
            await discordReply(interaction, `Le salon ${channel_select.name} a été supprimé avec succès.`)
        }
        const embed = new EmbedBuilder()
            .setTitle("Suppression d'un salon temporaire")
            .setDescription(`Le salon ***${channel_select.name}*** a été supprimé par ${member} le <t:${Math.floor(Date.now() / 1000)}:f>`)
            .addFields({name: "Raison", value: reason.value.toString()})
        await log_channel.send({embeds: [embed]});

    } else {
        const embed = new EmbedBuilder()
            .setTitle("Demande de suppression d'un salon temporaire")
            .setDescription(`Le salon ${channel_select} a été demandé à être supprimé par ${member} le <t:${Math.floor(Date.now() / 1000)}:f>`)
            .addFields({name: "Raison", value: reason.value.toString()})
        //ajouter un bouton pour accepter la demande de suppression ou pour la refuser
        const customIdDelete = `tempChannelDelete_delete_${channel_select.id}`

        //vérifier si une demande de suppression a déjà été envoyée (si le message existe) en cherchant un message avec le même customId (vérifier les messages des dernières 48h) (utilisé after:2d dans la barre de recherche)
        const date = new Date(Date.now()-48*60*60*1000)
        const twoDaysAgoSnowflake = (date.getTime() * 1000).toString();

        const message = await log_channel.messages.fetch({after:twoDaysAgoSnowflake, limit: 100})
        const messageExist = message.find(message => message.components[0]?.components[0]?.customId === customIdDelete)
        if (messageExist) {
            await discordReply(interaction, `Une demande de suppression du salon ${channel_select} est déjà en cours de traitement. Si aucune action n'a été effectuée au bout de 48h, vous pourrez en refaire une.`)
            return;
        }


        const actionRow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Accepter")
                    .setStyle(ButtonStyle.Success)
                    .setCustomId(customIdDelete),
                new ButtonBuilder()
                    .setLabel("Refuser")
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId(`tempChannelDelete_cancel_${channel_select.id}`)
            )

        await log_channel.send({
            embeds: [embed],
            components: [actionRow]
        })

        await discordReply(interaction, `La demande de suppression du salon ${channel_select} a été envoyée avec succès.`)
    }
    return true;
}
