import { MessageFlags, TextDisplayBuilder } from "discord.js";
import SubCommand from "../../../class/SubCommand.js";

export default new SubCommand({
  async execute(interaction) {
    const category = interaction.options.getChannel("category", true);
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
        data: { archiveCategory: category.id }
      })
      .catch(async (error: any) => {
        interaction.client.logManager.logger.error(
          `Erreur lors de la mise à jour de la catégorie d'archive pour le serveur ${guild.id}: ${error.message}`,
          {
            status: "ready",
            category: "config-setArchiveCategory",
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
                "Une erreur est survenue lors de la mise à jour de la catégorie d'archive."
            })
          ],
          flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
        });
        return;
      })
      .then(() => {
        interaction.client.logManager.logger.verbose(
          `Catégorie d'archive mise à jour pour le serveur \`${guild.id}\` : \`${category.name}\``,
          {
            status: "ready",
            category: "config-setArchiveCategory",
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
          content: `La catégorie d'archive a été définie sur \`${category.name}\`.`
        })
      ],
      flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
    });
  }
});
