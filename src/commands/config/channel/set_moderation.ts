import { MessageFlags, TextDisplayBuilder } from "discord.js";
import SubCommand from "../../../class/SubCommand.js";

export default new SubCommand({
  async execute(interaction) {
    const channel = interaction.options.getChannel("channel", true);
    const guild = interaction.guild;

    if (!guild) {
      await interaction.reply({
        components: [
          new TextDisplayBuilder({
            content: "Cette commande ne peut être utilisée que dans un serveur."
          })
        ],
        flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
      });
      return;
    }

    interaction.client.prisma.guild
      .update({
        where: { id: guild.id },
        data: { moderationChannel: channel.id }
      })
      .catch(async (error: any) => {
        interaction.client.logManager.logger.error(
          `Erreur lors de la mise à jour du salon de modération pour le serveur ${guild.id}: ${error.message}`,
          {
            status: "ready",
            category: "config-setModerationChannel",
            metadata: {
              interactionType: interaction.type,
              command: interaction.commandName,
              options: interaction.options?.data ?? [],
              user: interaction.user.id,
              guild: guild.id
            }
          }
        );
        await interaction.reply({
          components: [
            new TextDisplayBuilder({
              content:
                "Une erreur est survenue lors de la mise à jour du salon de modération."
            })
          ],
          flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
        });
        return;
      })
      .then(() => {
        interaction.client.logManager.logger.verbose(
          `Salon de modération mis à jour pour le serveur \`${guild.id}\` : \`${channel.name}\``,
          {
            status: "ready",
            category: "config-setModerationChannel",
            metadata: {
              interactionType: interaction.type,
              command: interaction.commandName,
              options: interaction.options?.data ?? [],
              user: interaction.user.id,
              guild: guild.id
            }
          }
        );
      });
    await interaction.reply({
      components: [
        new TextDisplayBuilder({
          content: `Le salon de modération a été défini sur \`${channel.name}\`.`
        })
      ],
      flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
    });
  }
});
