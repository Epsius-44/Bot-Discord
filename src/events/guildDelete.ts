import { Guild, Events, Client } from "discord.js";
import Event from "../class/Event.js";

export default new Event({
  name: Events.GuildDelete,
  once: false,

  execute(client: Client, guild: Guild): void {
    client.logManager.logger.info(
      `Le bot a quitté un serveur : ${guild.name} (${guild.id})`,
      {
        status: "ready",
        category: "events-guildDelete",
        metadata: {
          guild: guild.id
        }
      }
    );
  }
});
