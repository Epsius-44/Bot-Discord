import {Events, Interaction} from "discord.js";
import {BotEvent} from "../types";

const event: BotEvent = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction: Interaction) {
        if (process.env.LZLHA_IS_MASTER === "false") {
            interaction.client.log.info("This bot is not the master bot. Ignoring interaction.");
            return;
        }
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.slashCommands.get(interaction.commandName);

        if (!command) return;

        await command.execute(interaction);
    }
}

export default event;
