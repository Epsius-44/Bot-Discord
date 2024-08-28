import { BaseInteraction, Events } from "discord.js";
import Event from "../class/Event.js";
import AppCommand from "../class/AppCommand.js";

export default new Event({
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: BaseInteraction): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

    const command: AppCommand | undefined = interaction.client.appCommands.get(
      interaction.commandName
    );

    if (!command) {
      await interaction.reply({
        content:
          "Je suis désolé mais je n'arrive pas à me souvenir où j'ai laissé cette commande.",
        ephemeral: true
      });
      interaction.client.logger.error(
        `interaction - La commande ${interaction.commandName} demandée par ${interaction.user.tag} est introuvable`
      );
      return;
    }

    if (!command.execute) {
      await interaction.reply({
        content:
          "J'ai cette commande sur le bout de la langue, mais impossible de m'en rappeler.",
        ephemeral: true
      });
      interaction.client.logger.error(
        `interaction - La commande ${interaction.commandName} demandée par ${interaction.user.tag} est introuvable`
      );
      return;
    }

    await command.execute(interaction);
    return;
  }
});
