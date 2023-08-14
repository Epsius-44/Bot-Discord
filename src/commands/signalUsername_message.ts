import {AppCommand} from "../types";
import {
    ApplicationCommandType,
    AutoModerationRuleTriggerType,
    ContextMenuCommandBuilder,
    PermissionFlagsBits
} from "discord.js";
import signalUsername from "./signalUsername/signalUsername";

const command: AppCommand = {
    roles: [process.env.ROLE_RESPONSABLE_ID],
    data: new ContextMenuCommandBuilder()
        .setName('Signaler le pseudo')
        .setType(ApplicationCommandType.Message)
        .setDMPermission(false),
    // .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    execute: async (interaction) => {
        const message = interaction.options.getMessage('message');
        const user = message.author;
        await signalUsername(interaction, user);
    }
}

export default command;
