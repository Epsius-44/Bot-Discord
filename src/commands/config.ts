import { InteractionContextType, SlashCommandBuilder } from "discord.js";
import AppCommand from "../class/AppCommand.js";

export default new AppCommand({
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Configure les fonctionnalités du bot")
    .setContexts([InteractionContextType.Guild])
    .addSubcommandGroup((group) =>
      group
        .setName("groups")
        .setDescription(
          "Gérer les groupes de rôles pour les salons temporaires"
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("create")
            .setDescription("Crée un nouveau groupe de rôles")
        )
    ),
  hasSubCommands: true
});
