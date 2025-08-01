import { MessageFlags, TextDisplayBuilder } from "discord.js";
import SubCommand from "../../../class/SubCommand.js";

export default new SubCommand({
  async execute(interaction) {
    const role = interaction.options.getRole("role", true);
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
        data: { moderatorRole: role.id }
      })
      .catch(async (error: any) => {
        interaction.client.logManager.logger.error(
          `Erreur lors de la mise à jour du rôle de modérateur pour le serveur ${guild.id}: ${error.message}`,
          {
            status: "ready",
            category: "config-setModeratorRole",
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
                "Une erreur est survenue lors de la mise à jour du rôle de modérateur."
            })
          ],
          flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
        });
        return;
      })
      .then(() => {
        interaction.client.logManager.logger.verbose(
          `Rôle de modérateur mis à jour pour le serveur \`${guild.id}\` : \`${role.name}\``,
          {
            status: "ready",
            category: "config-setModeratorRole",
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
          content: `Le rôle de modérateur a été défini sur \`${role.name}\`.`
        })
      ],
      flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
    });
  }
});
