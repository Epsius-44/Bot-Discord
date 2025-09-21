import {
  BaseInteraction,
  Client,
  Events,
  MessageFlags,
  TextDisplayBuilder
} from "discord.js";
import Event from "../class/Event.js";
import AppCommand from "../class/AppCommand.js";

export default new Event({
  name: Events.InteractionCreate,
  once: false,

  async execute(client: Client, interaction: BaseInteraction): Promise<void> {
    if (interaction.isChatInputCommand()) {
      const command: AppCommand | undefined =
        interaction.client.appCommands.get(interaction.commandName);

      // Si la commande n'existe pas, on log l'erreur et on envoie un message d'erreur à l'utilisateur
      if (!command || command === undefined) {
        client.logManager.logger.warn(
          `Activation de la commande inconnue \`${interaction.commandName}\` par ${interaction.user.id}`,
          {
            status: "ready",
            category: "events-interactionCreate-chatInputCommand",
            metadata: {
              interactionType: interaction.type,
              command: interaction.commandName,
              options: interaction.options?.data ?? [],
              user: interaction.user.id,
              guild: interaction.guild?.id
            }
          }
        );
        interaction.reply({
          components: [
            new TextDisplayBuilder().setContent(
              "Je ne me souviens pas de cette commande !"
            )
          ],
          flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
        });
        return;
      }

      // Exclure le cas où execute n'est pas défini
      if (!command.execute) {
        client.logManager.logger.warn(
          `Activation de la commande sans fonction \`${interaction.commandName}\` par ${interaction.user.id}`,
          {
            status: "ready",
            category: "events-interactionCreate-chatInputCommand",
            metadata: {
              interactionType: interaction.type,
              command: interaction.commandName,
              options: interaction.options?.data ?? [],
              user: interaction.user.id,
              guild: interaction.guild?.id
            }
          }
        );
        interaction.reply({
          components: [
            new TextDisplayBuilder().setContent(
              "Je ne sais pas comment exécuter cette commande !"
            )
          ],
          flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
        });
        return;
      }
      client.logManager.logger.verbose(
        `Activation de la commande \`${interaction.commandName}\` par ${interaction.user.id} ! Options: ${JSON.stringify(interaction.options?.data ?? [])}`,
        {
          status: "ready",
          category: "events-interactionCreate-chatInputCommand",
          metadata: {
            interactionType: interaction.type,
            command: interaction.commandName,
            options: JSON.stringify(interaction.options?.data ?? []),
            user: interaction.user.id,
            guild: interaction.guild?.id
          }
        }
      );
      await command.execute(interaction);
    } else if (interaction.isAutocomplete()) {
      const command = interaction.client.appCommands.get(
        interaction.commandName
      );
      if (!command) return;
      //exécuter l'autocomplete de la commande si elle a été définie
      if (command.autocomplete) {
        await command.autocomplete(interaction);
      }
    } else
      client.logManager.logger.warn(
        `L'interaction ne fait pas partie des types gérés par le bot : ${interaction.type}`,
        {
          status: "ready",
          category: "events-interactionCreate",
          metadata: {
            interactionType: interaction.type,
            user: interaction.user.id,
            guild: interaction.guild?.id
          }
        }
      );
    return;
  }
});
