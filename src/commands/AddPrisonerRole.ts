import {SlashCommand} from "../types";
import {SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField, TextChannel} from "discord.js";
import {
    checkMemberHasRole,
    checkMemberOnServer,
    checkPermission,
    checkRoleExist, discordReply,
    getCommandMemberAsGuildMember,
    getMemberFromUser, sendDM, sendLogEmbed
} from "../modules/discordFunction";

const command: SlashCommand = {
    name: "prisonnier",
    data: new SlashCommandBuilder()
        .setName('prisonnier')
        .setDescription("Mettre un utilisateur en prison")
        .addUserOption(option => option
            .setName('utilisateur')
            .setDescription("Utilisateur à mettre en prison")
            .setRequired(true))
        .addStringOption(option => option
            .setName('raison')
            .setDescription("Raison de pourquoi l'utilisateur est en prison")
            .setRequired(true))
        // l'utilisateur doit avoir la permission de mute les membres pour utiliser cette commande
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        // la commande ne peut pas être utilisée en DM
        .setDMPermission(false),
    execute: async (interaction) => {

        const userPrisoner = interaction.options.getUser('utilisateur');
        const reason = interaction.options.get('raison') ? interaction.options.get('raison').value : "";
        const commandUser = getCommandMemberAsGuildMember(interaction)
        const prisonerRole = interaction.guild?.roles.cache.find(role => role.id === process.env.PRISONER_ROLE_ID);
        if (!await checkRoleExist(interaction, prisonerRole, "Le rôle pour les prisonniers n'a pas été trouvé")) return;
        const memberPrisoner = await getMemberFromUser(interaction, userPrisoner)

        // vérifié que l'utilisateur a la permission de mute
        if (!await checkPermission(interaction, commandUser, PermissionsBitField.Flags.ModerateMembers, `Vous n'avez pas la permission de mettre en prison`)) return;

        if (!await checkMemberOnServer(interaction, memberPrisoner)) return;

        // vérifié que l'utilisateur ciblé n'a pas déjà le rôle prisonnier
        if (!await checkMemberHasRole(interaction, memberPrisoner, prisonerRole, `L'utilisateur est déjà en prison`, true)) return;

        await memberPrisoner.roles.add(prisonerRole)
        // .catch(async err => {
        //     await discordReply(interaction, `L'utilisateur ${userPrisoner} n'a pas pu être mis en prison. L'erreur suivante est survenue : ${err}.`, true)
        // });
        // envoie un message à l'utilisateur unmute
        const messageDM = await sendDM(userPrisoner, `Vous avez été mis en prison sur le serveur **${interaction.guild?.name}** pour la raison suivante: ***${reason}***.\nVos interactions avec le serveur **${interaction.guild?.name}** ont été restrainte.`)
            ? `L'utilisateur a été notifié de sa sentence.` : `L'utilisateur n'a pas pu être notifié de sa sentence car il a bloqué les messages privés.`;
        // renvoie un message à l'utilisateur qui a utilisé la commande
        await discordReply(interaction, `Vous avez attribué le rôle ${prisonerRole} à **${userPrisoner}** pour la raison suivante: ***${reason}***\n${messageDM}`)
        // envoie un message dans le channel de log (id stocké dans .env)
        const channel = interaction.client.channels.cache.get(process.env.CHANNEL_LOG_ID!);
        if (!channel) return;
        // await (channel as TextChannel).send(`**${commandUser}** a mis **${userPrisoner}** en prison.\nRaison: ***${reason}***`)
        await sendLogEmbed((channel as TextChannel), commandUser, userPrisoner, String(reason), `Attribution du rôle ${prisonerRole}`);    }
}

export default command;
