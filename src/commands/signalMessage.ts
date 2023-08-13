import {AppCommand} from "../types";
import {ApplicationCommandType, ContextMenuCommandBuilder, EmbedBuilder, PermissionFlagsBits} from "discord.js";
import {checkMemberHasRole} from "../modules/discordFunction";

const command: AppCommand = {
    name: "report",
    data: new ContextMenuCommandBuilder()
        .setName('report')
        .setType(ApplicationCommandType.Message)
        .setDMPermission(false),
    // .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    execute: async (interaction) => {
        const message = interaction.options.getMessage('message');
        //vérifié que l'utilisateur à le rôle de délégué / responsable
        const role_responsable = interaction.guild?.roles.cache.get(process.env.ROLE_RESPONSABLE_ID);
        const role_admin = interaction.guild?.roles.cache.get(process.env.ROLE_ADMIN_ID);
        const log_channel = interaction.guild?.channels.cache.get(process.env.CHANNEL_LOG_ID);
        const member = interaction.member;
        let is_remove = true;
        let author_is_removable = true;

        if (!await checkMemberHasRole(interaction, member, role_responsable)) return;

        const embed = new EmbedBuilder()
            .setTitle(`Signalement d'un message`)
            .setColor(0xff8c00)


        //vérifié que le message puisse être supprimé
        if (!message.deletable) {
            is_remove = false;
        }

        //vérifié que l'auteur du message n'est pas un bot, un webhook ou un administrateur
        if (message.author.bot || message.webhookId || message.member?.roles.cache.has(role_admin?.id)) {
            is_remove = false;
            author_is_removable = false;
        }

        //vérifié que le message n'est pas trop vieux (plus de 2 semaines)
        if (message.createdTimestamp < Date.now() - 14 * 24 * 60 * 60 * 1000) {
            is_remove = false;
        }

        if (is_remove) {
            await message.delete().catch(() => {
                is_remove = false;
            })
        }

        if (!is_remove) {
            if (message.createdTimestamp < Date.now() - 14 * 24 * 60 * 60 * 1000) {
                embed.setDescription(`Le message n'a pas pu être supprimé car il est trop vieux (plus de 2 semaines).`)
            } else if (author_is_removable) {
                embed.setDescription(`Le message n'a pas pu être supprimé car une erreur est survenue.`)
            } else {
                embed.setDescription(`Le message n'a pas pu être supprimé car le message provient d'un bot, d'un webhook ou d'un administrateur.`)
            }
        }

        embed.addFields(
            {
                name: 'Auteur du signalement',
                value: `${member}`,
                inline: false
            },
            {
                name: "Date du signalement",
                value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
                inline: false
            },
            {
                name: 'auteur du message',
                value: `${message.author}`,
                inline: false
            },
            {
                name: 'salon du message',
                value: `${message.channel}`,
                inline: false
            },
            {
                name: 'date du message',
                value: `<t:${Math.floor(message.createdTimestamp / 1000)}:F>`,
                inline: false
            },
            {
                //si le message fait plus de 1024 caractères, tronquer le message et ajouter "..."
                name: 'contenu du message',
                value: message.content === "" ? ("Aucun texte") : (message.content.length > 1024 ? `${message.content.substring(0, 1021)}...` : message.content),
                inline: false
            },
            {
                name: 'Action',
                value: is_remove ? `Le message a été supprimé` : `${role_admin} Demande de suppression du [message](${message.url}).`,
                inline: false
            }
        );

        //envoyer le message dans le channel de log
        await log_channel?.send({embeds: [embed]});

        //envoyer un message de confirmation
        await interaction.reply({
                content: `Le message a été signalé ${is_remove ? `et supprimé` : `. Une demande de suppression du message a été envoyée aux ${role_admin}`}\n**Tout abus du système de signalement sera sanctionné.**`,
                ephemeral: true
            }
        );

        //envoyer un message dans le channel du message signalé
        await message.channel.send({
            content: `${member} a signalé un message de ${message.author} le <t:${Math.floor(Date.now() / 1000)}:F>.${is_remove ? `. Le message a été supprimé.` : ""}`,
        });
    }
}

export default command;
