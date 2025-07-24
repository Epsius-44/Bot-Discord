import { Client, Events } from "discord.js";
import Event from "../class/Event.js";

export default new Event({
  name: Events.ClientReady,
  once: true,

  execute(client: Client): void {
    client.logManager.logger.info(
      `Le bot est connecté avec discord et est disponible !`,
      {
        status: "ready",
        category: "client-ready"
      }
    );

    client.logManager.logger.verbose(
      `===== INFORMATION SUR LE BOT =====
🤖 Bot: ${client.user?.username} (${client.user?.id})
---
📅 Date de démarrage: ${new Date().toLocaleString()}
✅ Statut: ${client.ws.status === 0 ? "En ligne" : "Hors ligne"}
🔗 Latence: ${client.ws.ping}ms
---
⚡ Commandes: ${client.appCommands?.size || 0}
📡 Événements: ${client.eventNames().length}
---
🏫 Serveurs: ${client.guilds.cache.size || 0}
👥 Utilisateurs: ${client.users.cache.size || 0}
==================================`,
      {
        status: "ready",
        category: "client-ready"
      }
    );
  }
});
