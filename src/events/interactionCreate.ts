import { BaseInteraction, Events } from "discord.js";
import Event from "../class/Event.js";
import AppCommand from "../class/AppCommand.js";

export default new Event({
  name: Events.InteractionCreate,
  once: false,

  async execute(interaction: BaseInteraction): Promise<void> {
    if (interaction.isChatInputCommand()) {
      const command: AppCommand | undefined =
        interaction.client.appCommands.get(interaction.commandName);

      // Si la commande n'existe pas, on log l'erreur et on envoie un message d'erreur à l'utilisateur
      if (!command || command === undefined) {
        interaction.client.logger.warn(
          `Commande inconnue : \`${interaction.commandName}\``,
          { labels: { job: "interaction" } }
        );
        interaction.reply({
          content: "Je ne me souviens pas de cette commande !",
          ephemeral: true
        });
        return;
      }

      // Si la commande requiert des permissions, on vérifie si l'utilisateur a les permissions nécessaires
      if (command.roles !== undefined && command.roles.length > 0) {
        const member = interaction.guild?.members.cache.get(
          interaction.user.id
        );
        if (!member) {
          interaction.client.logger.warn(
            `Membre introuvable : ${interaction.user.id}`,
            { labels: { job: "interaction" } }
          );
          interaction.reply({
            content: "Je ne me souviens pas de toi !",
            ephemeral: true
          });
          return;
        }
        const roles = member.roles.cache;
        const hasPermission = command.roles.some((role) => roles.has(role));
        if (!hasPermission) {
          interaction.client.logger.warn(
            `Permission manquante pour \`${interaction.commandName}\` : ${interaction.user.id}`,
            { labels: { job: "interaction" } }
          );
          interaction.reply({
            content: "Tu n'as pas la permission d'utiliser cette commande !",
            ephemeral: true
          });
          return;
        }
      }
      // Exclure le cas où execute n'est pas défini
      if (!command.execute) {
        interaction.client.logger.warn(
          `Commande \`${interaction.commandName}\` sans fonction execute`,
          { labels: { job: "interaction" } }
        );
        interaction.reply({
          content: "Je ne sais pas comment exécuter cette commande !",
          ephemeral: true
        });
        return;
      }
      interaction.client.logger.debug(
        `Activation de la commande \`${interaction.commandName}\` par ${interaction.user.id} !`,
        { labels: { job: "interaction" } }
      );
      await command.execute(interaction);
    } else if (interaction.isButton()) {
      //obtenir l'id du bouton qui a été cliqué (uniquement jusqu'à '_')
      const buttonId = interaction.customId.split("_")[0];
      const button = interaction.client.appButtons.get(buttonId);
      if (!button) return;
      //exécuter le bouton
      interaction.client.logger.debug(
        `Activation du bouton \`${interaction.customId}\` par ${interaction.user.id} !`,
        { labels: { job: "interaction" } }
      );
      await button.execute(interaction);
    } else if (interaction.isAutocomplete()) {
      const command = interaction.client.appCommands.get(
        interaction.commandName
      );
      if (!command) return;
      //exécuter l'autocomplete de la commande si elle a été définie
      if (command.autocomplete) {
        await command.autocomplete(interaction);
      }
    }
  }
});
