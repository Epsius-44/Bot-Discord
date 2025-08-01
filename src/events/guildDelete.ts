import { Client, Events, Guild } from "discord.js";
import Event from "../class/Event.js";

export default new Event({
  name: Events.GuildDelete,
  once: false,

  execute(client: Client, guild: Guild): void {
    client.logManager.logger.verbose(
      `Le bot a quitté le serveur ${guild.name} (${guild.id}) !`,
      {
        status: "ready",
        category: "guild-delete",
        metadata: {
          guild: guild.id
        }
      }
    );
    client.prisma.guild
      .delete({
        where: {
          id: guild.id
        }
      })
      .then(() => {
        client.logManager.logger.debug(
          `Le serveur ${guild.name} (${guild.id}) a été retiré de la base de données`,
          {
            status: "ready",
            category: "guild-delete",
            metadata: {
              guild: guild.id
            }
          }
        );
      })
      .catch((error: any) => {
        client.logManager.logger.error(
          `Erreur lors de la suppression du serveur ${guild.name} (${guild.id}) de la base de données : ${error.message}`,
          {
            status: "error",
            category: "guild-delete",
            metadata: {
              guild: guild.id,
              error: error.message
            }
          }
        );
      });
  }
});
