import {SlashCommand} from "../types";
import {SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField, TextChannel} from "discord.js";
import {
    discordReply,
    getMemberFromUser,
    checkPermission,
    getCommandMemberAsGuildMember,
    checkMemberOnServer,
    checkMemberIsTimeout
} from "../modules/discordFunction";


const command: SlashCommand = {
    name: "unmute",
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription("Rendre la parole à un utilisateur muté")
        .addUserOption(option => option
            .setName('utilisateur')
            .setDescription("Utilisateur à unmute")
            .setRequired(true))
        .addStringOption(option => option
            .setName('raison')
            .setDescription("Raison du unmute"))
        // l'utilisateur doit avoir la permission de mute les membres pour utiliser cette commande
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        // la commande ne peut pas être utilisée en DM
        .setDMPermission(false),
    execute: async (interaction) => {

        const userTimeout = interaction.options.getUser('utilisateur');
        const reasonTimeout = interaction.options.get('raison') ? interaction.options.get('raison').value : "";
        const commandUser = getCommandMemberAsGuildMember(interaction);
        const memberTimeout = await getMemberFromUser(interaction, userTimeout);

        // vérifié que l'utilisateur a la permission de mute
        if (!await checkPermission(interaction, commandUser, PermissionsBitField.Flags.ModerateMembers, `Vous n'avez pas la permission d'enlever le mute`)) return;

        // vérifié que l'utilisateur ciblé est sur le serveur
        if (!await checkMemberOnServer(interaction, memberTimeout)) return;

        // vérifié que l'utilisateur ciblé est mute
        if (!await checkMemberIsTimeout(interaction, memberTimeout)) return;

        // unmute l'utilisateur
        await memberTimeout.timeout(null, String(reasonTimeout))
            .catch(async err => {
                await discordReply(interaction, `Impossible d'enlever le mute de l'utilisateur ${userTimeout}. L'erreur suivante est survenue : ${err}.`);
                return;
            });

        const reason = reasonTimeout ? ` pour la raison suivante : ***${reasonTimeout}***.` : ".";
        let messageDM = "L'utilisateur a été notifié de la fin de sa sentence.";
        // envoie un message à l'utilisateur unmute
        await userTimeout.send(`Vous pouvez de nouveau interagir sur le serveur **${interaction.guild?.name}**${reason}`).catch(
            async () => {
                messageDM = "L'utilisateur n'a pas pu être notifié de la fin de sa sentence car il a bloqué les messages privés.";
            }
        )
        // renvoie un message à l'utilisateur qui a utilisé la commande
        await discordReply(interaction, `Vous avez enlever le mute de **${userTimeout}**${reason}\n${messageDM}`);

        // envoie un message dans le channel de log (id stocké dans .env)
        const channel = interaction.client.channels.cache.get(process.env.CHANNEL_LOG_ID!);
        if (!channel) return;
        const reasonLog = reasonTimeout ? `\nRaison: ***${reasonTimeout}***.` : "";
        await (channel as TextChannel).send(`**${commandUser}** a libéré **${userTimeout}** de son mute.${reasonLog}`)
            .catch(async err => {
                await discordReply(interaction, `Impossible d'envoyer un message dans le channel de log. L'erreur suivante est survenue : ${err}.`);
                return;
            });
    }
}

export default command;
