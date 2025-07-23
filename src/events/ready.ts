import { Client, Events } from "discord.js";
import Event from "../class/Event.js";

export default new Event({
  name: Events.ClientReady,
  once: true,

  execute(client: Client): void {
    console.info(
      `start: Le bot ${client.user?.username} est prêt ! (${client.user?.id})`
    );
  }
});
