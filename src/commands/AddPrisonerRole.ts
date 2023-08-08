import {SlashCommand} from "../types";
import {SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField, TextChannel} from "discord.js";

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
        const commandUser = interaction.member;
        const prisonerRole = interaction.guild?.roles.cache.find(role => role.id === process.env.PRISONER_ROLE_ID);
        if (!prisonerRole) {
            await interaction.reply(
                {
                    content: `Le rôle pour les prisonniers n'a pas été trouvé`,
                    ephemeral: true
                }
            );
            return;
        }
        const memberPrisoner = await interaction.guild?.members.fetch(userPrisoner).then(
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
        if (!commandUser.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            await interaction.reply(
                {
                    content: `Vous n'avez pas la permission de mettre en prison`,
                    ephemeral: true
                }
            );
            return;
        }

        // vérifié que l'utilisateur ciblé est sur le serveur
        if (!memberPrisoner) {
            await interaction.reply(
                {
                    content: `L'utilisateur n'est pas sur le serveur`,
                    ephemeral: true
                }
            );
            return;
        }

        // vérifié que l'utilisateur ciblé n'a pas déjà le rôle prisonnier
        if (memberPrisoner.roles.cache.has(prisonerRole?.id)) {
            await interaction.reply(
                {
                    content: `L'utilisateur est déjà en prison`,
                    ephemeral: true
                }
            );
            return;
        }

        await memberPrisoner.roles.add(prisonerRole)
            .then(async () => {
                let messageDM = "L'utilisateur a été notifié de sa sentence.";
                // envoie un message à l'utilisateur unmute
                await userPrisoner.send(`Vous avez été mis en prison sur le serveur **${interaction.guild?.name}** pour la raison suivante: ***${reason}***.
Vos interactions avec le serveur ont été restrainte`).catch(
                    async err => {
                        messageDM = "L'utilisateur n'a pas pu être notifié de sa sentence car il a bloqué les messages privés.";
                    }
                )
                // renvoie un message à l'utilisateur qui a utilisé la commande
                await interaction.reply(
                    {
                        content: `Vous avez attribué le rôle ${prisonerRole} à **${userPrisoner}** pour la raison suivante: ***${reason}***
${messageDM}`,
                        ephemeral: true
                    }
                );
                // envoie un message dans le channel de log (id stocké dans .env)
                const channel = interaction.client.channels.cache.get(process.env.CHANNEL_LOG_ID!);
                if (!channel) return;
                await (channel as TextChannel).send(`**${commandUser}** a mis **${userPrisoner}** en prison.
Raison: ***${reason}***`)
            })
            .catch(async err => {
                await interaction.reply(
                    {
                        content: `L'utilisateur ${userPrisoner} n'a pas pu être mis en prison. L'erreur suivante est survenue : ${err}.`,
                        ephemeral: true
                    }
                );
            });
    }
}

export default command;
