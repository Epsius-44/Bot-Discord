import {Events, Interaction} from "discord.js";
import {BotEvent} from "../types";

const event: BotEvent = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction: Interaction) {
        if (process.env.LZLHA_IS_MASTER === "false") {
            interaction.client.log.debug(`Ignore l'interaction ${interaction.id} de ${interaction.user.tag} car je ne suis pas le master`);
            return;
        }

        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) return;

        await command.execute(interaction);
    }
}

export default event;
