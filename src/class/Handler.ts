import { readdirSync, existsSync } from "fs";

/**
 * Représentation d'un handler
 */
export default class Handler {
  folder: string;
  files: string[];
  execute: (...args: any) => Promise<void> | void;

  /**
   * @param {{
   *      folder: string
   *      execute: (...args: any) => Promise<void> | void
   * }} object
   */
  constructor(object: {
    folder: string;
    execute: (...args: any) => Promise<void> | void;
  }) {
    this.folder = object.folder;
    this.files = existsSync(this.folder)
      ? readdirSync(this.folder).filter(
          (file) => file.endsWith(".js") || file.endsWith(".ts")
        )
      : [];
    this.execute = object.execute;
  }
}
