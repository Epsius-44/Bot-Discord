import {
    AutocompleteInteraction,
    ButtonInteraction,
    Collection,
    CommandInteraction,
    ContextMenuCommandBuilder,
    ModalSubmitInteraction,
    SlashCommandBuilder
} from "discord.js";
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
            CURL_UPDATE_URL: string,
            CURL_PING_URL: string,
            CURL_PING_INTERVAL: string,
            TIMEOUT_MS_EDT: string,
            BOT_MESSAGE: string,
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
    data: SlashCommandBuilder,
    execute: (interaction: CommandInteraction) => Promise<void>
    autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>
    roles?: string[] //liste des roles autorisés à utiliser la commande (si vide ou non défini, tout le monde peut utiliser la commande)
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
    data: ContextMenuCommandBuilder,
    execute: (message: Message) => Promise<void>,
    roles?: string[], //liste des roles autorisés à utiliser la commande (si vide ou non défini, tout le monde peut utiliser la commande)
}

export interface HelpCommand {
    name: string,
    description: string,
    args?: { name: string, description: string, required: boolean }[],
}

export interface IEdtEpsiJS {
    name: string,
    room: string,
    teacher: string,
    start_hour: string,
    end_hour: string
}

export {}
