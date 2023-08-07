import {SlashCommand} from "../types";
import {SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField, TextChannel} from "discord.js";

const timeOptions : { [key: string]: {seconds: number, name: string} } = {
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
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
        // la commande ne peut pas être utilisée en DM
        .setDMPermission(false),
    execute: async (interaction) => {

        const userTimeout = interaction.options.getUser('utilisateur');
        const memberTimeout = await interaction.guild?.members.fetch(userTimeout);
        const reasonTimeout = interaction.options.get('raison').value;
        const durationTimeout = interaction.options.get('durée').value;
        const unitTimeout = interaction.options.get('unité').value.toString();
        const durationTimeoutSeconds = Number(durationTimeout) * timeOptions[unitTimeout].seconds;
        const commandUser = interaction.member;


        // vérifié que l'utilisateur a la permission de mute
        //TODO: Corriger la vérification de la permission (la fonction has() ne semble pas prendre le bon type en entrée)
        if (!commandUser.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
            await interaction.reply(
                { content:`Vous n'avez pas la permission de mute`,
                    ephemeral: true }
            );
            return;
        }

        // vérifié que l'utilisateur ciblé est sur le serveur
        if (!memberTimeout) {
            await interaction.reply(
                { content:`L'utilisateur n'est pas sur le serveur`,
                    ephemeral: true }
            );
            return;
        }

        // vérifié que l'utilisateur ciblé est muteable
        if (!memberTimeout.kickable) {
            await interaction.reply(
                { content:`L'utilisateur n'est pas muteable`,
                    ephemeral: true }
            );
            return;
        }

        //vérifié que la durée du mute est égal ou inférieur à la durée maximum
        if (durationTimeoutSeconds > timeoutMax * 60 * 60 * 24) {
            await interaction.reply(
                { content:`La durée maximum est de ${timeoutMax} secondes`,
                    ephemeral: true }
            );
            return;
        }

        //vérifié que la durée du mute est supérieur à 0
        if (durationTimeoutSeconds <= 0) {
            await interaction.reply(
                { content:`La durée doit être supérieur à 0`,
                    ephemeral: true }
            );
            return;
        }

        const timestampTimeout = Math.round(Date.now() / 1000) + durationTimeoutSeconds;

        // mute l'utilisateur
        await memberTimeout.timeout(1000 * timeOptions[unitTimeout].seconds * Number(durationTimeout), String(reasonTimeout))
            .then(async () => {
        await interaction.reply(
            { content:`Vous avez muté **${userTimeout}** pendant **${durationTimeout} ${timeOptions[unitTimeout].name}** pour la raison suivante : ***${reasonTimeout}***.
Fin du mute: **<t:${timestampTimeout}:R>**`,
                ephemeral: true }
        );
        // envoie un message à l'utilisateur muté
        await userTimeout.send(`Vous avez été mute pendant **${durationTimeout} ${timeOptions[unitTimeout].name}** sur le serveur **${interaction.guild?.name}** pour la raison suivante : ***${reasonTimeout}***
Fin du mute: **<t:${timestampTimeout}:R>**`);
        // envoie un message dans le channel de log (id stocké dans .env)
            const channel = interaction.client.channels.cache.get(process.env.CHANNEL_LOG_ID!);
            if (!channel) return;
            await (channel as TextChannel).send(`**${commandUser}** a mute **${userTimeout}** pendant **${durationTimeout} ${timeOptions[unitTimeout].name}**.
Raison: ***${reasonTimeout}***
Fin du mute: **<t:${timestampTimeout}:R>**`);

    }).catch(async err => {
        console.log(err);
        await interaction.reply(
            { content: "L'utilisateur " + userTimeout + " n'a pas pu être mute. L'erreur suivante est survenue : " + err + ".", ephemeral: true }
        );
    });
    }
}

export default command;
