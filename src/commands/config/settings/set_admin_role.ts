import SubCommand from "../../../class/SubCommand.js";

export default new SubCommand({
  async execute(interaction) {
    const role = interaction.options.getRole("role", true);
    const guild = interaction.guild;

    if (!guild) {
      await interaction.reply({
        content: "Cette commande ne peut être utilisée que dans un serveur.",
        ephemeral: true
      });
      return;
    }

    interaction.client.prisma.guild
      .update({
        where: { id: guild.id },
        data: { adminRole: role.id }
      })
      .catch(async (error: any) => {
        interaction.client.logManager.logger.error(
          `Erreur lors de la mise à jour du rôle d'administrateur pour le serveur ${guild.id}: ${error.message}`,
          {
            status: "ready",
            category: "config-setAdminRole",
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
          content:
            "Une erreur est survenue lors de la mise à jour du rôle d'administrateur.",
          ephemeral: true
        });
        return;
      })
      .then(async () => {
        interaction.client.logManager.logger.verbose(
          `Rôle d'administrateur mis à jour pour le serveur \`${guild.id}\` : \`${role.name}\``,
          {
            status: "ready",
            category: "config-setAdminRole",
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
      content: `Le rôle d'administrateur a été défini sur \`${role.name}\`.`,
      ephemeral: true
    });
  }
});
