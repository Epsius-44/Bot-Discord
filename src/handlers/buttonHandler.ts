import Handler from "../class/Handler.js";
import Button from "../class/Button.js";
import { Client } from "discord.js";

export default new Handler({
  folder: `${process.env.APP_PATH}/buttons`,

  async execute(client: Client, files: string[]): Promise<void> {
    client.logger.info("start:button - Début du chargement des boutons");
    for (const file of files) {
      const button: Button = (await import(`${this.folder}/${file}`))
        .default as Button;
      client.appButtons.set(button.name, button);
      client.logger.debug(`start:button - Le bouton ${button.name} est chargé`);
    }
    client.logger.info("start:button - Fin du chargement des boutons");
  }
});
