import {
  EmbedBuilder,
  InteractionContextType,
  SlashCommandBuilder
} from "discord.js";
import AppCommand from "../class/AppCommand.js";
import packageInfo from "../../package.json" assert { type: "json" };

export default new AppCommand({
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Affiche l'état du bot à un instant T")
    .setContexts([InteractionContextType.Guild]),
  hasSubCommands: false,
  roles: [process.env.ROLE_ADMIN_ID],
  async execute(interaction): Promise<void> {
    // Section version et dépendances
    const versionEmbed = new EmbedBuilder()
      .setTitle("Version et dépendances du bot")
      .setDescription(`Le bot actif est en version \`${packageInfo.version}\``)
      .setColor("#fdd017");
    for (const dep in packageInfo.dependencies) {
      versionEmbed.addFields({
        name: `${dep}`,
        value: dep.startsWith("@luzilab/")
          ? // @ts-expect-error TS7053 Erreur dans la récupération du type de la version des dépendances
            `[${packageInfo.dependencies[dep]}](<https://gitlab.com/groups/Luzilab/epsinyx/-/packages>)`
          : // @ts-expect-error TS7053 Erreur dans la récupération du type de la version des dépendances
            `[${packageInfo.dependencies[dep]}](<https://www.npmjs.com/package/${dep}>)`,
        inline: true
      });
    }

    // Section base de données
    const bddInfo = await interaction.client.db.admin().serverInfo();
    const clusterStatus = await interaction.client.db
      .admin()
      .replSetGetStatus();
    const bddEmbed = new EmbedBuilder()
      .setTitle("Base de données")
      .setDescription(
        `MongoDB en version \`${bddInfo.version}\` sur le cluster \`${clusterStatus.set}\` sur la base \`${interaction.client.db.databaseName}\``
      )
      .setColor("#50c878");
    clusterStatus.members.forEach(
      (member: {
        _id: string;
        health: number;
        stateStr: string;
        uptime: number;
      }) => {
        bddEmbed.addFields({
          name: `Membre ${member._id}`,
          value: `- Etat ${member.health === 1 ? ":white_check_mark: OK" : ":warning: NOK " + member.health}\n- Rôle: ${member.stateStr === "PRIMARY" ? ":green_circle:" : ":orange_circle:"} ${member.stateStr}\n- Uptime: \`${member.uptime}\`s`,
          inline: true
        });
      }
    );

    const haEmbed = new EmbedBuilder()
      .setTitle("Haute disponibilité")
      .setDescription("__**Pas encore en place**__")
      .setColor("#b90e0a");

    await interaction.reply({
      content: "Pong ! Voici les informations sur l'état du bot",
      ephemeral: true,
      embeds: [versionEmbed, bddEmbed, haEmbed]
    });
  }
});
