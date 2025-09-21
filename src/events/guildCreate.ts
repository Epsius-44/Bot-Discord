import { Guild, Events, Client } from "discord.js";
import Event from "../class/Event.js";

export default new Event({
  name: Events.GuildCreate,
  once: false,

  execute(client: Client, guild: Guild): void {
    client.logManager.logger.info(
      `Le bot a rejoint un nouveau serveur : ${guild.name} (${guild.id})`,
      {
        status: "ready",
        category: "events-guildCreate",
        metadata: {
          guild: guild.id
        }
      }
    );
  }
});
