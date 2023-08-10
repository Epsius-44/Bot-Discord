import {
    checkLength,
    checkMemberHasRole,
    discordReply,
} from "../../modules/discordFunction";
import {ChannelType, CommandInteraction, GuildMember, PermissionsBitField} from "discord.js";

export default async function addTempChannel(
    interaction: CommandInteraction,
    choices: { name: string, tag: string, role_id: string }[],
    categorie_id: string,
    member: GuildMember,
){
    const module = interaction.options.get('module');
    const groupe = interaction.options.get('groupe');
    const role = interaction.guild?.roles.cache.get(groupe.value.toString());
    if (!await checkLength(interaction, module.value.toString().length, 3, 30, "Le nom du salon doit faire entre 3 et 30 caractères")) return false;
    if (!await checkMemberHasRole(interaction, member, role, `Vous n'avez pas l'autorisation de créer un salon pour le groupe ${role}`)) return false;

    //définition des permissions
    const permissions = [
        {
            id: interaction.guild?.roles.everyone.id,
            deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
            id: role?.id,
            allow: [PermissionsBitField.Flags.ViewChannel]
        }
    ]

    //récupérer le nom du groupe et le tag à partir de l'id du role
    const groupe_name = choices.find(({role_id}) => role_id === groupe.value)?.name;
    const groupe_tag = choices.find(({role_id}) => role_id === groupe.value)?.tag;
    const channelName = `${groupe_tag}-${module.value.toString().replace(/\s+/g, "_")}`
    const channel = await interaction.guild?.channels.create(
        {
            name: channelName,
            type: ChannelType.GuildText,
            parent: categorie_id,
            reason: `Création du salon temporaire ${channelName} via la commande /temp_channel add par ${member.user.username} (${member.user.globalName})`,
            permissionOverwrites: permissions
        })

    //envoyer un message dans le salon pour informer de la création du salon
    await channel?.send(`Ce salon a été créé <t:${Math.floor(Date.now() / 1000)}:R> par ${member} pour le module **${module.value}** du groupe **${groupe_name}**`)
    await discordReply(interaction, `Le salon ${channel} a été créé avec succès.`)
    return true;
}