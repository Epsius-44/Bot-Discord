import Handler from "../class/Handler.js";
import Event from "../class/Event.js";
import { Client } from "discord.js";

export default new Handler({
  name: "eventHandler",
  folder: `${process.env.APP_PATH}/events`,

  async execute(client: Client, files: string[]): Promise<void> {
    client.logManager.logger.info("Chargement des évènements...", {
      status: "starting",
      category: "events"
    });
    for (const file of files) {
      const event: Event = (await import(`${this.folder}/${file}`))
        .default as Event;
      client.logManager.logger.verbose(
        `Chargement de l'évènement ${event.name}`,
        {
          status: "starting",
          category: `events-${event.name}`
        }
      );
      if (event.once) {
        client.once(event.name, (...args) => void event.execute(...args));
      } else {
        client.on(event.name, (...args) => void event.execute(...args));
      }
      client.logManager.logger.debug(`L'évènement ${event.name} est chargé`, {
        status: "starting",
        category: `events-${event.name}`
      });
    }
  }
});
