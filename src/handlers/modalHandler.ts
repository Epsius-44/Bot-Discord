import Handler from "../class/Handler.js";
import { Client } from "discord.js";
import Modal from "../class/Modal.js";

export default new Handler({
  folder: `${process.env.APP_PATH}/modals`,

  async execute(client: Client, files: string[]): Promise<void> {
    client.logger.info("Début du chargement des modales", {
      labels: { job: "start" }
    });
    for (const file of files) {
      const modal: Modal = (await import(`${this.folder}/${file}`))
        .default as Modal;
      client.appButtons.set(modal.name, modal);
      client.logger.debug(`La modale ${file} est chargé`, {
        labels: { job: "start" }
      });
    }
    client.logger.info("Fin du chargement des modales", {
      labels: { job: "start" }
    });
  }
});
