import {SlashCommand} from "../types";
import {SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField, TextChannel} from "discord.js";

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
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
        // la commande ne peut pas être utilisée en DM
        .setDMPermission(false),
    execute: async (interaction) => {

        const userTimeout = interaction.options.getUser('utilisateur');
        const reasonTimeout = interaction.options.get('raison') ? interaction.options.get('raison').value : "";
        const commandUser = interaction.member;
        const memberTimeout = await interaction.guild?.members.fetch(userTimeout).then(
            member => {
                return member;
            }
        ).catch(
            err => {
                return null;
            }
        )

        // vérifié que l'utilisateur a la permission de mute
        //TODO: Corriger la vérification de la permission (la fonction has() ne semble pas prendre le bon type en entrée)
        if (!commandUser.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
            await interaction.reply(
                {
                    content: `Vous n'avez pas la permission de unmute`,
                    ephemeral: true
                }
            );
            return;
        }

        // vérifié que l'utilisateur ciblé est sur le serveur
        if (!memberTimeout) {
            await interaction.reply(
                {
                    content: `L'utilisateur n'est pas sur le serveur`,
                    ephemeral: true
                }
            );
            return;
        }

        // vérifié que l'utilisateur ciblé est mute
        if (!memberTimeout.communicationDisabledUntil) {
            await interaction.reply(
                {
                    content: `L'utilisateur n'est pas muté`,
                    ephemeral: true
                }
            );
            return;
        }

        // unmute l'utilisateur
        await memberTimeout.timeout(null, String(reasonTimeout))
            .then(async () => {
                const reason = reasonTimeout ? ` pour la raison suivante : ***${reasonTimeout}***.` : ".";
                await interaction.reply(
                    {
                        content: `Vous avez unmute **${userTimeout}**${reason}`,
                        ephemeral: true
                    }
                );
                // envoie un message à l'utilisateur unmute
                await userTimeout.send(`Vous pouvez de nouveau interagir sur le serveur **${interaction.guild?.name}**${reason}`);
                // envoie un message dans le channel de log (id stocké dans .env)
                const channel = interaction.client.channels.cache.get(process.env.CHANNEL_LOG_ID!);
                if (!channel) return;
                const reasonLog = reasonTimeout ? `\nRaison: ***${reasonTimeout}***.` : "";
                await (channel as TextChannel).send(`**${commandUser}** a libéré **${userTimeout}** de son mute.${reasonLog}`)
                    .catch(async err => {
                        await interaction.reply(
                            {
                                content: "L'utilisateur " + userTimeout + " n'a pas pu être unmute. L'erreur suivante est survenue : " + err + ".",
                                ephemeral: true
                            }
                        );
                    });
            })
    }
}

export default command;
