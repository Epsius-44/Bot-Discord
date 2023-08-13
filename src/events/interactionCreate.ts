import {Events, Interaction, InteractionType} from "discord.js";
import {BotEvent} from "../types";

const event: BotEvent = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction: Interaction) {
        if (interaction.isChatInputCommand()) {

            const command = interaction.client.slashCommands.get(interaction.commandName);
            if (!command) return;
            await command.execute(interaction);

        } else if (interaction.isButton()) {

            //obtenir l'id du bouton qui a été cliqué (uniquement jusqu'à '_')
            const buttonId = interaction.customId.split('_')[0];
            const button = interaction.client.buttons.get(buttonId);
            if (!button) return;
            //exécuter le bouton
            await button.execute(interaction);

        } else if (interaction.isAutocomplete()) {
            const command = interaction.client.slashCommands.get(interaction.commandName);
            if (!command) return;
            await command.autocomplete(interaction);
        } else if (interaction.isModalSubmit()) {
            const modalId = interaction.customId.split('_')[0];
            const modal = interaction.client.modals.get(modalId);
            if (!modal) return;
            await modal.execute(interaction);
        }
        else return;
    }
}

export default event;
