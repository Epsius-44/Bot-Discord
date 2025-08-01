import { Client, Events, Guild } from "discord.js";
import Event from "../class/Event.js";

export default new Event({
  name: Events.GuildCreate,
  once: false,

  execute(client: Client, guild: Guild): void {
    client.logManager.logger.verbose(
      `Le bot a rejoint un nouveau serveur ${guild.name} (${guild.id}) !`,
      {
        status: "ready",
        category: "guild-new",
        metadata: {
          guild: guild.id
        }
      }
    );
    client.prisma.guild
      .create({
        data: {
          id: guild.id
        }
      })
      .then(() => {
        client.logManager.logger.debug(
          `Le serveur ${guild.name} (${guild.id}) a été ajouté à la base de données`,
          {
            status: "ready",
            category: "guild-new",
            metadata: {
              guild: guild.id
            }
          }
        );
      })
      .catch((error: any) => {
        client.logManager.logger.error(
          `Erreur lors de l'ajout du serveur ${guild.name} (${guild.id}) à la base de données : ${error.message}`,
          {
            status: "error",
            category: "guild-new",
            metadata: {
              guild: guild.id,
              error: error.message
            }
          }
        );
      });
  }
});
