/**
 * Représentation d'une modale
 */
export default class Modal {
  name: string;
  execute: (...args: any) => Promise<void> | void;

  /**
   * @param {{
   *      name: string,
   *      execute: (...args: any) => Promise<void> | void
   *  }} object
   */
  constructor(object: {
    name: string;
    execute: (...args: any) => Promise<void> | void;
  }) {
    this.name = object.name;
    this.execute = object.execute;
  }
}
