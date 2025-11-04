import Handler from "../class/Handler.js";
import Modal from "../class/Modal.js";
import { Client } from "discord.js";

export default new Handler({
  name: "modalHandler",
  folder: `${process.env.APP_PATH}/modals`,

  async execute(client: Client, files: string[]): Promise<void> {
    client.logManager.logger.info("Chargement des modales...", {
      status: "starting",
      category: "modals"
    });
    for (const file of files) {
      const modal: Modal = (await import(`${this.folder}/${file}`))
        .default as Modal;
      client.logManager.logger.verbose(
        `Chargement de la modale ${modal.name}`,
        {
          status: "starting",
          category: `modals-${modal.name}`
        }
      );
      client.modals.set(modal.name, modal);
      client.logManager.logger.debug(`La modale ${modal.name} est chargée`, {
        status: "starting",
        category: `modals-${modal.name}`
      });
    }
  }
});
