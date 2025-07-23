import {
  InteractionContextType,
  MessageFlags,
  SlashCommandBuilder
} from "discord.js";
import AppCommand from "../class/AppCommand.js";

export default new AppCommand({
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Commande de test pour vérifier si le bot est en ligne")
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.BotDM,
      InteractionContextType.PrivateChannel
    ]),
  hasSubCommands: false,
  async execute(interaction): Promise<void> {
    await interaction.reply({
      content: "Pong !",
      flags: MessageFlags.Ephemeral
    });
  }
});
