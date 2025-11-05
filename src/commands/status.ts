import {
  ContainerBuilder,
  InteractionContextType,
  MessageFlags,
  SlashCommandBuilder,
  TextDisplayBuilder
} from "discord.js";
import AppCommand from "../class/AppCommand.js";
import packageInfo from "../../package.json" with { type: "json" };

export default new AppCommand({
  data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("Affiche l'état du bot à l'instant T")
    .setContexts([InteractionContextType.Guild]),
  isPublic: false,
  hasSubCommands: false,
  async execute(interaction): Promise<void> {
    // Récupère des informations sur le bot
    const client = interaction.client;
    // Récupère le nombre de commandes enregistrées dans le client
    const commands = client.appCommands
      ? Array.from(client.appCommands.keys())
      : Array.from(client.application?.commands.cache.values() ?? []).map(
          (cmd) => cmd.name
        );
    const commandsCount = commands.length;

    // Récupère les évènements et leur nombre d'écouteurs
    const eventNames = client.eventNames ? client.eventNames() : [];
    const eventsList = eventNames.map((event) => String(event));
    const eventsCount = eventsList.length;

    const uptime = client.uptime ? Math.floor(client.uptime / 1000) : 0;
    const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;

    // Formatage Discord pour la durée : <t:timestamp:R>
    const now = Math.floor(Date.now() / 1000);
    const startedAt = now - uptime;
    const formattedUptime = `<t:${startedAt}:R>`;

    const statusMessage = [
      `## Information sur le bot`,
      `### Informations génériques`,
      `📅 Disponible depuis : ${formattedUptime}`,
      `🏫 Serveurs : \`${client.guilds.cache.size || 0}\``,
      `👥 Utilisateurs : \`${client.users.cache.size || 0}\``,
      `### Informations sur l'instance`,
      `🤖 Instance active : \`${process.env.LZL_BOT_INSTANCE_NAME}\` (${process.env.NODE_ENV})`,
      `📊 Mémoire utilisée : \`${memoryUsage.toFixed(2)}\` Mo`,
      `### Informations sur la version`,
      `📦 Version de l'application : \`${packageInfo.version}\``,
      `⚡ Commandes chargées : \`${commandsCount}\`` +
        (commandsCount > 0 ? ` (${commands.join(", ")})` : ""),
      `🖼️ Modales chargées : \`${client.modals.size}\`` +
        (client.modals.size > 0
          ? ` (${Array.from(client.modals.keys()).join(", ")})`
          : ""),
      `📡 Évènements chargés : \`${eventsCount}\`` +
        (eventsCount > 0 ? ` (${eventsList.join(", ")})` : "")
    ]
      .filter(Boolean)
      .join("\n");

    await interaction.reply({
      components: [
        new ContainerBuilder().addTextDisplayComponents(
          new TextDisplayBuilder().setContent(statusMessage)
        )
      ],
      flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
    });
  }
});
