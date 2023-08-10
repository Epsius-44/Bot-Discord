import {SlashCommand} from "../types";
import {SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField, TextChannel} from "discord.js";
import {
    discordReply,
    getMemberFromUser,
    checkPermission,
    getCommandMemberAsGuildMember,
    checkMemberOnServer,
    checkMemberKickable, sendDM, sendLogEmbed
} from "../modules/discordFunction";

const timeOptions: { [key: string]: { seconds: number, name: string } } = {
    s: {seconds: 1, name: "secondes"},
    m: {seconds: 60, name: "minutes"},
    h: {seconds: 60 * 60, name: "heures"},
    d: {seconds: 60 * 60 * 24, name: "jours"},
}

// transforme timeOptions en {name: "secondes", value: "s"} pour chaque entrée de timeOptions
const timeOptionsChoices = Object.entries(timeOptions).map(([key, value]) => {
    return {name: value.name, value: key}
})

const timeoutMax = 28 // durée maximum d'un timeout en jours (autorisé par discord)

const command: SlashCommand = {
    name: "mute",
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription("Mute un utilisateur")
        .addUserOption(option => option
            .setName('utilisateur')
            .setDescription("Utilisateur à mute")
            .setRequired(true))
        .addStringOption(option => option
            .setName('raison')
            .setDescription("Raison du mute")
            .setRequired(true))
        .addIntegerOption(option => option
            .setName('durée')
            .setDescription("Durée du mute")
            .setRequired(true))
        .addStringOption(option => option
            .setName('unité')
            .setDescription("Unité de la durée du mute")
            .setRequired(true)
            .addChoices(
                ...timeOptionsChoices
            )
        )
        // l'utilisateur doit avoir la permission de mute les membres pour utiliser cette commande
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        // la commande ne peut pas être utilisée en DM
        .setDMPermission(false),
    execute: async (interaction) => {

        const userTimeout = interaction.options.getUser('utilisateur');
        const memberTimeout = await getMemberFromUser(interaction, userTimeout);
        const reasonTimeout = interaction.options.get('raison').value;
        const durationTimeout = interaction.options.get('durée').value;
        const unitTimeout = interaction.options.get('unité').value.toString();
        const durationTimeoutSeconds = Number(durationTimeout) * timeOptions[unitTimeout].seconds;
        const commandUser = getCommandMemberAsGuildMember(interaction);

        // vérifié que l'utilisateur a la permission de mute
        if (!await checkPermission(interaction, commandUser, PermissionsBitField.Flags.ModerateMembers, `Vous n'avez pas la permission de mute`)) return;
        // vérifié que l'utilisateur ciblé est sur le serveur
        if (!await checkMemberOnServer(interaction, memberTimeout, `L'utilisateur n'est pas sur le serveur`)) return;
        // vérifié que l'utilisateur ciblé peut être mute
        if (!await checkMemberKickable(interaction, memberTimeout, `L'utilisateur ne peut pas être mute`)) return;

        //vérifié que la durée du mute est égal ou inférieur à la durée maximum
        if (durationTimeoutSeconds > timeoutMax * 60 * 60 * 24) {
            await discordReply(interaction, `La durée maximum est de ${timeoutMax} jours`);
            return;
        }

        const timestampTimeout = Math.round(Date.now() / 1000) + durationTimeoutSeconds;
        // mute l'utilisateur
        await memberTimeout.timeout(1000 * timeOptions[unitTimeout].seconds * Number(durationTimeout), String(reasonTimeout))
            // .catch(async err => {
            //     await discordReply(interaction, `L'utilisateur ${userTimeout} n'a pas pu être mute. L'erreur suivante est survenue : ${err}.`);
            //     return;
            // });

        // envoie un message à l'utilisateur muté
        const messageDM = await sendDM(userTimeout, `Vous avez été mute pendant **${durationTimeout} ${timeOptions[unitTimeout].name}** sur le serveur **${interaction.guild?.name}** pour la raison suivante : ***${reasonTimeout}***\nFin du mute: **<t:${timestampTimeout}:R>**`)
        ? "L'utilisateur a été notifié du mute." : "L'utilisateur n'a pas pu être notifié du mute car il a bloqué les messages privés.";

        await discordReply(interaction, `L'utilisateur ${userTimeout} a été mute pendant ${durationTimeout} ${timeOptions[unitTimeout].name} pour la raison suivante : ***${reasonTimeout}***.
Fin du mute: **<t:${timestampTimeout}:R>**
${messageDM}`);

        // envoie un message dans le channel de log (id stocké dans .env)
        const channel = interaction.client.channels.cache.get(process.env.CHANNEL_LOG_ID!);
        if (!channel) return;

        //         await (channel as TextChannel).send(`**${commandUser}** a mute **${userTimeout}** pendant **${durationTimeout} ${timeOptions[unitTimeout].name}**.
        // Raison: ***${reasonTimeout}***
        // Fin du mute: **<t:${timestampTimeout}:R>**`);
        await sendLogEmbed((channel as TextChannel), commandUser, userTimeout, String(reasonTimeout), `Timeout (${durationTimeout} ${timeOptions[unitTimeout].name})`, true, timestampTimeout);

    }
}

export default command;
