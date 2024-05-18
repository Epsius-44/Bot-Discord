import { Collection } from 'discord.js'
import { ActiveHA } from './class/ActiveHA'
import { Logger } from './class/Logger'
import AppCommand from './class/AppCommand'

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DISCORD_CLIENT_ID: string
            DISCORD_TOKEN: string
            GUILD_ROLE_ADMIN: string
            GUILD_ROLE_DELEGUE: string
            GUILD_ROLE_INTERVENANT: string
            LZLHA_IS_MASTER: string
            LZLHA_INSTANCE_ID: string
            LZLHA_INSTANCE_NAME: string
            LZLHA_REDIS_URI: string
        }
    }
    type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
}

declare module 'discord.js' {
    export interface Client {
        activeHA?: ActiveHA
        logger: Logger
        applicationCommands: Collection<string, AppCommand>
    }
}

export {}
