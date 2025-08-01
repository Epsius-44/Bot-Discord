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
        .setName("settings")
        .setDescription("Configure les paramètres généraux du bot")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("set_admin_role")
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
            .setName("set_moderator_role")
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
            .setName("set_tempchannel_category")
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
            .setName("set_archive_category")
            .setDescription("Définir la catégorie d'archivage pour le serveur")
            .addChannelOption((option) =>
              option
                .setName("category")
                .setDescription("La catégorie à définir pour l'archivage")
                .addChannelTypes(ChannelType.GuildCategory)
                .setRequired(true)
            )
        )
    )
});
