import { ButtonInteraction } from "discord.js";
import Button from "../class/Button.js";

export default new Button({
  name: "role",

  execute(interaction: ButtonInteraction): void {
    interaction.reply({
      content: "Tu as cliqué sur le bouton !",
      ephemeral: true
    });
  }
});
