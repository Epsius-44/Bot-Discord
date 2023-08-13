import {AppCommand} from "../types";
import {
    ApplicationCommandType,
    AutoModerationRuleTriggerType,
    ContextMenuCommandBuilder,
    PermissionFlagsBits
} from "discord.js";
import signalUsername from "./signalUsername/signalUsername";

const command: AppCommand = {
    name: "Signaler ce pseudo",
    data: new ContextMenuCommandBuilder()
        .setName('Signaler ce pseudo')
        .setType(ApplicationCommandType.User)
        .setDMPermission(false),
    // .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    execute: async (interaction) => {
        const user = interaction.options.getUser('user');
        await signalUsername(interaction,user);
    }
}

export default command;
