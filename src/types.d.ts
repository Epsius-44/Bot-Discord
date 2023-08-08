import {Collection, CommandInteraction, SlashCommandBuilder} from "discord.js";
import {Logtail} from "@logtail/node";
import {Logger} from "./modules/logger";

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DISCORD_CLIENT_ID: string,
            DISCORD_TOKEN: string,
            LOGTAIL_TOKEN: string,
            CHANNEL_LOG_ID: string
        }
    }
}

declare module "discord.js" {
    export interface Client {
        slashCommands: Collection<string, SlashCommand>,
        log: Logger;
    }
}

export interface BotEvent {
    name: string,
    once?: boolean | false,
    execute: (...args) => void
}

export interface SlashCommand {
    name: string,
    data: SlashCommandBuilder,
    execute: (interaction: CommandInteraction) => Promise<void>
}

export {}
