import { Client } from "discord.js";

/**
 * Représentation d'un événement
 */
export default class Event {
  name: string;
  once: boolean;
  execute: (client: Client, ...args: any) => Promise<void> | void;

  /**
   * @param {{
   *      name: string,
   *      once: boolean,
   *      execute: (client: Client, ...args: any) => Promise<void> | void
   *  }} object
   */
  constructor(object: {
    name: string;
    once?: boolean;
    execute: (client: Client, ...args: any) => Promise<void> | void;
  }) {
    this.name = object.name;
    this.once = object.once ?? false;
    this.execute = object.execute;
  }
}
