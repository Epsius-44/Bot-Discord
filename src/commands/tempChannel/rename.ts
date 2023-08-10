import {checkLength, discordReply} from "../../modules/discordFunction";
import {CommandInteraction, GuildMember, TextChannel} from "discord.js";

export default async function renameTempChannel(
    interaction: CommandInteraction,
    channel_select: TextChannel,
    categorie_id: string,
    member: GuildMember,
)
{
    if (!channel_select) return false;
    //vérifier que le salon est bien un salon temporaire et qu'il est bien dans la catégorie des salons temporaires
    if (channel_select.parentId !== categorie_id) {
        await discordReply(interaction, "Ce salon n'est pas un salon temporaire. Vous n'avez pas la permission de le renommer.")
        return false;
    }

    const name = interaction.options.get('nom');
    if (!await checkLength(interaction, name.value.toString().length, 3, 30, "Le nom du salon doit faire entre 3 et 30 caractères")) return false;
    //garder les premiers caractères du nom du salon (jusqu'au premier tiret) pour récupérer le tag du groupe
    const name_tag = channel_select.name.split("-")[0];
    const channelName_rename = `${name_tag}-${name.value.toString().replace(/\s+/g, "_")}`
    const last_name = channel_select.name;
    await channel_select.setName(channelName_rename, `Renommage du salon temporaire via la commande /temp_channel rename par ${member.user.username} (${member.user.globalName})`)
    await discordReply(interaction, `Le salon ${channel_select} a été renommé avec succès.`)
    await channel_select.send(`Ce salon a été renommé (${last_name} → ${channelName_rename}) <t:${Math.floor(Date.now() / 1000)}:R> par ${member}.`)
    return true;
}