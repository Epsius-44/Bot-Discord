import {discordReply} from "../../modules/discordFunction";
import {CommandInteraction, GuildMember, PermissionFlagsBits, TextChannel} from "discord.js";

export default async function archiveTempChannel(
    interaction: CommandInteraction,
    channel_select: TextChannel,
    categorie_id: string,
    member: GuildMember,
) {
    if (!channel_select) return false;
    //vérifier que le salon est bien un salon temporaire et qu'il est bien dans la catégorie des salons temporaires
    if (channel_select.parentId !== categorie_id) {
        await discordReply(interaction, "Ce salon n'est pas un salon temporaire. Vous n'avez pas la permission de l'archiver.")
        return false;
    }

    //récupérer la liste des id des personnes et rôles ayant des permissions sur le salon
    const permission = channel_select.permissionOverwrites.cache.map(perm => {
        return {
            id: perm.id,
            type: perm.type
        }
    });

    const permission_archive = []

    //ajouter les permissions de lecture pour les personnes et rôles ayant des permissions sur le salon (sauf le rôle @everyone)
    permission.forEach((perm) => {
        if (perm.id !== interaction.guild?.roles.everyone.id) {
            permission_archive.push({
                id: perm.id,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory],
                deny: [PermissionFlagsBits.AddReactions, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.SendMessages],
                type: perm.type
            })
        } else {
            permission_archive.push({
                id: perm.id,
                deny: [PermissionFlagsBits.ViewChannel],
                allow: [],
                type: perm.type
            })
        }
    });

    await channel_select.setParent(process.env.CHANNEL_ARCHIVE_CATEGORIE_ID);
    //modifier les permissions du salon pour que tout le monde puisse le voir, mais pas y écrire
    await channel_select.permissionOverwrites.set(permission_archive, `Archivage du salon temporaire via la commande /temp_channel archive par ${member.user.username} (${member.user.globalName})`)

    //envoyé un message dans le salon pour informer de l'archivage du salon
    await channel_select.send(`Ce salon vient a été archivé <t:${Math.floor(Date.now() / 1000)}:R> par ${member}.`)
    await discordReply(interaction, `Le salon ${channel_select} a été archivé avec succès.`)
    return true;
}