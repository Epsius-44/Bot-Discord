import { BaseInteraction, Events } from "discord.js";
import Event from "../class/Event.js";

export default new Event({
  name: Events.InteractionCreate,
  once: false,
  execute(interaction: BaseInteraction): void {
    return interaction.client.logger.warn(
      `interaction - L'interaction ${interaction.id} a été ignorée`
    );
  }
});
