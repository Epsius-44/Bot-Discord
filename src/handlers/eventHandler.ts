import Handler from "../class/Handler.js";
import Event from "../class/Event.js";
import { Client } from "discord.js";

export default new Handler({
  folder: `${process.env.APP_PATH}/events`,

  async execute(client: Client, files: string[]): Promise<void> {
    client.logger.info("Début du chargement des évènements", {
      labels: { job: "start" }
    });
    for (const file of files) {
      const event: Event = (await import(`${this.folder}/${file}`))
        .default as Event;
      if (event.once) {
        client.once(event.name, (...args) => void event.execute(...args));
      } else {
        client.on(event.name, (...args) => void event.execute(...args));
      }
      client.logger.debug(`L'évènement ${event.name} est chargé`, {
        labels: { job: "start" }
      });
    }
    client.logger.info("Fin du chargement des évènements", {
      labels: { job: "start" }
    });
  }
});
