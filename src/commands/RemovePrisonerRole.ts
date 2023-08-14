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
    roles: [process.env.ROLE_ADMIN_ID],
    data: new SlashCommandBuilder()
        .setName('libération')
        .setDescription("Libérer un utilisateur de prison")
        .addUserOption(option => option
            .setName('utilisateur')
            .setDescription("Utilisateur à libérer de prison")
            .setRequired(true))
        .addStringOption(option => option
            .setName('raison')
            .setDescription("Raison de pourquoi l'utilisateur à été libéré de prison"))
        // l'utilisateur doit avoir la permission de mute les membres pour utiliser cette commande
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        // la commande ne peut pas être utilisée en DM
        .setDMPermission(false),
    execute: async (interaction) => {

        const userPrisoner = interaction.options.getUser('utilisateur');
        const reason = interaction.options.get('raison') ? interaction.options.get('raison').value : "";
        const reasonString = reason ? ` pour la raison suivante : ***${reason}***` : "";
        const commandUser = getCommandMemberAsGuildMember(interaction)
        const prisonerRole = interaction.guild?.roles.cache.find(role => role.id === process.env.PRISONER_ROLE_ID);
        if (!await checkRoleExist(interaction, prisonerRole, "Le rôle pour les prisonniers n'a pas été trouvé")) return;
        const memberPrisoner = await getMemberFromUser(interaction, userPrisoner)

        // vérifié que l'utilisateur a la permission de mute
        //TODO: Corriger la vérification de la permission (la fonction has() ne semble pas prendre le bon type en entrée)
        if (!await checkPermission(interaction, commandUser, PermissionsBitField.Flags.ModerateMembers, `Vous n'avez pas la permission de libérer de prison`)) return;

        if (!await checkMemberOnServer(interaction, memberPrisoner)) return;

        if (!await checkMemberHasRole(interaction, memberPrisoner, prisonerRole, `L'utilisateur n'est pas en prison`)) return;


        //TODO: Retirer le rôle de la bdd
        await memberPrisoner.roles.remove(prisonerRole)
            // .catch(async err => {
            //     await discordReply(interaction, `L'utilisateur ${userPrisoner} n'a pas pu être libéré de prison. L'erreur suivante est survenue : ${err}.`)
            //     return;
            // });

        // envoie un message à l'utilisateur unmute
        const messageDM = await sendDM(userPrisoner, `Vous avez été libéré de prison sur le serveur **${interaction.guild?.name}**${reasonString}.`)
        ? `L'utilisateur a été notifié de sa libération.` : `L'utilisateur n'a pas pu être notifié de sa libération car il a bloqué les messages privés.`;
        // renvoie un message à l'utilisateur qui a utilisé la commande
        await discordReply(interaction, `Vous avez libéré l'utilisateur ${userPrisoner} de prison.${reasonString}\n${messageDM}`)
        // envoie un message dans le channel de log (id stocké dans .env)
        const channel = interaction.client.channels.cache.get(process.env.CHANNEL_LOG_ID!);
        if (!channel) return;
        // const reasonLog = reason ? ` Raison: ***${reason}***` : "";
//         await (channel as TextChannel).send(`**${commandUser}** a libéré **${userPrisoner}** de prison.
        // ${reasonLog}`)
        await sendLogEmbed((channel as TextChannel), commandUser, memberPrisoner, String(reason), "Libération de prison", false);

    }
}

export default command;
