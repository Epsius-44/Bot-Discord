import {
  ChannelType,
  InteractionContextType,
  SlashCommandBuilder
} from "discord.js";
import AppCommand from "../class/AppCommand.js";

export default new AppCommand({
  hasSubCommands: true,
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Configure les paramètres du bot")
    .setContexts([InteractionContextType.Guild])
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName("role")
        .setDescription(
          "Configure les associations de rôles entre le bot et le serveur Discord"
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("set_admin")
            .setDescription("Définir le rôle d'administrateur pour le serveur")
            .addRoleOption((option) =>
              option
                .setName("role")
                .setDescription("Le rôle à définir comme administrateur")
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("set_moderator")
            .setDescription("Définir le rôle de modérateur pour le serveur")
            .addRoleOption((option) =>
              option
                .setName("role")
                .setDescription("Le rôle à définir comme modérateur")
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("set_teacher")
            .setDescription("Définir le rôle d'enseignant pour le serveur")
            .addRoleOption((option) =>
              option
                .setName("role")
                .setDescription("Le rôle à définir comme enseignant")
                .setRequired(true)
            )
        )
    )
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName("channel")
        .setDescription(
          "Configure les associations de canaux entre le bot et le serveur Discord"
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("set_tempchannel")
            .setDescription(
              "Définir la catégorie des salons temporaires pour le serveur"
            )
            .addChannelOption((option) =>
              option
                .setName("category")
                .setDescription(
                  "La catégorie à définir pour les salons temporaires"
                )
                .addChannelTypes(ChannelType.GuildCategory)
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("set_archive")
            .setDescription("Définir la catégorie d'archivage pour le serveur")
            .addChannelOption((option) =>
              option
                .setName("category")
                .setDescription("La catégorie à définir pour l'archivage")
                .addChannelTypes(ChannelType.GuildCategory)
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("set_moderation")
            .setDescription("Définir le salon de modération pour le serveur")
            .addChannelOption((option) =>
              option
                .setName("channel")
                .setDescription("Le salon à définir pour la modération")
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
            )
        )
    )
});
