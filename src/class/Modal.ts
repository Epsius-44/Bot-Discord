import { ModalSubmitInteraction } from "discord.js";

/**
 * Représentation d'une modale
 */
export default class Modal {
  name: string;
  execute: (...args: any) => Promise<void> | void;

  /**
   * @param {{
   *      name: string,
   *      execute: () => Promise<void> | void
   *  }} object
   */
  constructor(object: {
    name: string;
    execute: (interaction: ModalSubmitInteraction) => Promise<void> | void;
  }) {
    this.name = object.name;
    this.execute = object.execute;
  }
}
