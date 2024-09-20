import Handler from "../class/Handler.js";
import Button from "../class/Button.js";
import { Client } from "discord.js";

export default new Handler({
  folder: `${process.env.APP_PATH}/buttons`,

  async execute(client: Client, files: string[]): Promise<void> {
    client.logger.info("Début du chargement des boutons", {
      labels: { job: "start" }
    });
    for (const file of files) {
      const button: Button = (await import(`${this.folder}/${file}`))
        .default as Button;
      client.appButtons.set(button.name, button);
      client.logger.debug(`Le bouton ${button.name} est chargé`, {
        labels: { job: "start" }
      });
    }
    client.logger.info("Fin du chargement des boutons", {
      labels: { job: "start" }
    });
  }
});
