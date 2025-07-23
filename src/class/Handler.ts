import { readdirSync, existsSync } from "fs";

/**
 * Représentation d'un handler
 */
export default class Handler {
  name: string;
  folder: string;
  files: string[];
  execute: (...args: any) => Promise<void> | void;

  /**
   * @param {{
   *      name: string,
   *      folder: string
   *      execute: (...args: any) => Promise<void> | void
   * }} object
   */
  constructor(object: {
    name: string;
    folder: string;
    execute: (...args: any) => Promise<void> | void;
  }) {
    this.name = object.name;
    this.folder = object.folder;
    this.files = existsSync(this.folder)
      ? readdirSync(this.folder).filter(
          (file) => file.endsWith(".js") || file.endsWith(".ts")
        )
      : [];
    this.execute = object.execute;
  }
}
