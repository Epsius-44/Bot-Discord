import { ActivityType, Client, Events } from "discord.js";
import Event from "../class/Event.js";

export default new Event({
  name: Events.ClientReady,
  once: true,

  execute(client: Client): void {
    client.logManager.logger.info(
      `Le bot est connecté avec discord et est disponible !`,
      {
        status: "ready",
        category: "events-clientReady"
      }
    );

    client.user?.setActivity({
      name: `Use /help | v${process.env.npm_package_version}`,
      type: ActivityType.Custom
    });

    const commands = client.appCommands
      ? Array.from(client.appCommands.keys())
      : Array.from(client.application?.commands.cache.values() ?? []).map(
          (cmd) => cmd.name
        );
    client.logManager.logger.verbose(
      `
===== INFORMATION SUR LE BOT =====
🤖 Bot: ${client.user?.username} (${client.user?.id})
---
📅 Date de démarrage: ${new Date().toLocaleString()}
✅ Statut: ${client.ws.status === 0 ? "En ligne" : "Hors ligne"}
---
⚡ Commandes: ${client.appCommands?.size || 0} (${commands.join(", ")})
📦 Modales: ${client.modals.size} (${Array.from(client.modals.keys()).join(", ")})
📡 Événements: ${client.eventNames().length} (${client.eventNames().join(", ")})
==================================`,
      {
        status: "ready",
        category: "events-clientReady"
      }
    );
  }
});
