import {
    Collection,
    CommandInteraction,
    SlashCommandBuilder,
    SlashCommandOptionsOnlyBuilder
} from "discord.js";
import {Logger} from "./modules/logger";
import {ActiveHa} from "./modules/active-ha";

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DISCORD_CLIENT_ID: string,
            DISCORD_TOKEN: string,
            GUILD_ROLE_ADMIN: string,
            GUILD_ROLE_DELEGUE: string,
            GUILD_ROLE_INTERVENANT: string,
            LZLHA_IS_MASTER: string,
            LZLHA_INSTANCE_ID: string,
            LZLHA_INSTANCE_NAME: string,
            LZLHA_REDIS_URI: string,
        }
    }
}

declare module "discord.js" {
    export interface Client {
        commands: Collection<string, SlashCommand>,
        log: Logger;
        activeHa: ActiveHa;
    }
}

export interface BotEvent {
    name: string,
    once?: boolean | false,
    execute: (...args) => void
}

export interface SlashCommand {
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder,
    execute: (interaction: CommandInteraction) => Promise<void>,
    roles?: string[], // Liste des rôles autorisés à utiliser la commande
}

export interface InstanceInfo {
    id: string,
    name: string,
    botVersion: string,
    nodeVersion: string,
    isOnline: boolean,
    isMaster: boolean,
}

export {}
