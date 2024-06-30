/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as dotenv from 'dotenv'
import { readdirSync } from 'fs'
import { Client, Collection, GatewayIntentBits } from 'discord.js'
import Handler from './class/Handler.js'
import { ActiveHA } from './class/ActiveHA.js'
import { Logger } from './class/Logger.js'
import type AppCommand from './class/AppCommand.js'

// Load environment variables from .env and .env.local files
dotenv.config()
dotenv.config({ path: '.env.local', override: true })

// Setup client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildVoiceStates
    ]
})

client.logger = new Logger()
client.applicationCommands = new Collection<string, AppCommand>()

if (process.env.LZLHA_IS_MASTER !== 'true') {
    process.env.LZLHA_IS_MASTER = 'false'
    client.activeHA = new ActiveHA(
        client,
        process.env.LZLHA_REDIS_URI,
        process.env.DISCORD_CLIENT_ID,
        process.env.LZLHA_INSTANCE_ID,
        process.env.LZLHA_INSTANCE_NAME
    )
}

const handlerFiles: string[] = readdirSync('./handlers').filter(
    (file) => file.endsWith('.js') || file.endsWith('.ts')
)
for (const file of handlerFiles) {
    const handler = (await import(`./handlers/${file}`)).default as Handler
    client.logger.debug(`LOAD - Lancement du chargeur ${file}`)
    await handler.execute(client, handler.files)
}

await client.login(process.env.DISCORD_TOKEN)
