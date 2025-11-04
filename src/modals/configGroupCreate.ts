import Modal from "../class/Modal.js";

export default new Modal({
  name: "configGroupCreate",

  execute(interaction): void {
    console.log("Modal interaction received:", interaction.customId);
  }
});
