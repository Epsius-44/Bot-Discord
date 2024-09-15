import { ButtonInteraction } from "discord.js";
import Button from "../class/Button.js";

export default new Button({
  name: "role",

  execute(interaction: ButtonInteraction): void {
    interaction.client.logger.info(`btn - Activation du bouton \`role\` !`);
  }
});
