import { Client, Events } from "discord.js";
import Event from "../class/Event.js";

export default new Event({
  name: Events.ClientReady,
  once: true,

  execute(client: Client): void {
    client.logger.info(
      `start:app - Bot lancé en tant que ${client.user?.tag} !`
    );
  }
});
