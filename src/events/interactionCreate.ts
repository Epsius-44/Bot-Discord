import {Events, Interaction, InteractionType} from "discord.js";
import {BotEvent} from "../types";
import {discordReply} from "../modules/discordFunction";

const event: BotEvent = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction: Interaction) {
        if (interaction.isChatInputCommand() || interaction.isMessageContextMenuCommand() || interaction.isUserContextMenuCommand()) {

            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) return;
            //récupération des permissions de l'utilisateur
            if (command.roles !== undefined && command.roles.length > 0) {
                const member = interaction.guild.members.cache.get(interaction.user.id);
                if (!member) return;
                const roles = member.roles.cache;
                const hasPermission = command.roles.some(role => roles.has(role));
                if (!hasPermission) {
                    //récupérer les rôles de la commande sous forme de rôles
                    const rolesCommand = command.roles.map(role => interaction.guild.roles.cache.get(role));
                    await discordReply(interaction, `Vous n'avez pas la permission d'utiliser cette commande, seul les rôles ${rolesCommand.join(', ')} peuvent l'utiliser`);
                    return;
                }
            }
            await command.execute(interaction);

        } else if (interaction.isButton()) {

            //obtenir l'id du bouton qui a été cliqué (uniquement jusqu'à '_')
            const buttonId = interaction.customId.split('_')[0];
            const button = interaction.client.buttons.get(buttonId);
            if (!button) return;
            //exécuter le bouton
            await button.execute(interaction);

        } else if (interaction.isAutocomplete()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) return;
            //exécuter l'autocomplete de la commande si elle a été définie
            if ("autocomplete" in command) {
                await command.autocomplete(interaction);
            }
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
