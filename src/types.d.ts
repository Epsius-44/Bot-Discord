import {
    AutocompleteInteraction,
    ButtonInteraction,
    Collection,
    CommandInteraction, ContextMenuCommandBuilder, ModalSubmitInteraction,
    SlashCommandBuilder
} from "discord.js";
import {Logtail} from "@logtail/node";
import {Logger} from "./modules/logger";

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DISCORD_CLIENT_ID: string,
            DISCORD_TOKEN: string,
            LOGTAIL_TOKEN: string,
            CHANNEL_LOG_ID: string
            PRISONER_ROLE_ID: string,
            CLASSROOM_LIST: string,
            CHANNEL_TEMP_CATEGORIE_ID: string,
            ROLE_RESPONSABLE_ID: string,
            CHANNEL_ARCHIVE_CATEGORIE_ID: string,
            ROLE_INTERVENANT_ID: string,
            ROLE_ADMIN_ID: string,
        }
    }
}

declare module "discord.js" {
    export interface Client {
        commands: Collection<string, SlashCommand | AppCommand>,
        buttons: Collection<string, ButtonActionMessage>,
        modals: Collection<string, Modal>,
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
    autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>
}

export interface ButtonActionMessage {
    name: string,
    execute: (interaction: ButtonInteraction) => Promise<void>
}

export interface Modal {
    name: string,
    execute: (interaction: ModalSubmitInteraction) => Promise<void>
}

export interface AppCommand {
    name: string,
    data: ContextMenuCommandBuilder,
    execute: (message: Message) => Promise<void>
}



export {}
