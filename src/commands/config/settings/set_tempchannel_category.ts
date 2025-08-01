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
        data: { tempChannelCategory: category.id }
      })
      .catch(async (error: any) => {
        interaction.client.logManager.logger.error(
          `Erreur lors de la mise à jour de la catégorie des salons temporaires pour le serveur ${guild.id}: ${error.message}`,
          {
            status: "ready",
            category: "config-setTempChannelCategory",
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
                "Une erreur est survenue lors de la mise à jour de la catégorie des salons temporaires."
            })
          ],
          flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
        });
        return;
      })
      .then(() => {
        interaction.client.logManager.logger.verbose(
          `Catégorie des salons temporaires mise à jour pour le serveur \`${guild.id}\` : \`${category.name}\``,
          {
            status: "ready",
            category: "config-setTempChannelCategory",
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
          content: `La catégorie des salons temporaires a été définie sur \`${category.name}\`.`
        })
      ],
      flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
    });
  }
});
