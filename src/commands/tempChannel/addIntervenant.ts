import {checkMemberHasRole, discordReply} from "../../modules/discordFunction";
import {CommandInteraction, PermissionsBitField, TextChannel} from "discord.js";

export default async function addIntervenant(
    interaction: CommandInteraction,
    channel_select: TextChannel,
    categorie_id: string,

)
{
    const intervenant = interaction.options.getUser('intervenant');
    if (!channel_select) return false;
    //vérifier que le salon est bien un salon temporaire et qu'il est bien dans la catégorie des salons temporaires
    if (channel_select.parentId !== categorie_id) {
        await discordReply(interaction, "Ce salon n'est pas un salon temporaire. Vous n'avez pas la permission d'ajouter un intervenant.")
        return false;
    }

    const intervenant_member = await interaction.guild?.members.fetch(intervenant.id);
    const intervenant_role = await interaction.guild?.roles.fetch(process.env.ROLE_INTERVENANT_ID);
    if (!await checkMemberHasRole(interaction, intervenant_member, intervenant_role, `${intervenant_member} n'est pas un intervenant.`)) return false;

    //vérifier que l'utilisateur n'est pas déjà dans la liste des personnes ayant l'autorisation de voir le salon
    if (channel_select.permissionOverwrites.cache.find(perm => perm.id === intervenant.id && perm.allow.has(PermissionsBitField.Flags.ViewChannel))) {
        await discordReply(interaction, "Cet utilisateur a déjà accès au salon.")
        return false;
    }

    //ajouter l'utilisateur à la liste des personnes ayant l'autorisation de voir le salon
    await channel_select.permissionOverwrites.edit(intervenant,
        {
            ViewChannel: true,
            ManageMessages: true,
            MentionEveryone: true,
        }
    )
    await discordReply(interaction, `L'intervenant ${intervenant} a été ajouté avec succès.`)
    await channel_select.send(`${interaction.user} a ajouté ${intervenant} au salon <t:${Math.floor(Date.now() / 1000)}:R>`)

    return true;
}