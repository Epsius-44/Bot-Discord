/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import Handler from '../class/Handler.js'
import AppCommand from '../class/AppCommand.js'
import { Client, REST, Routes } from 'discord.js'

export default new Handler({
    folder: './commands',
    async execute(client: Client, files: string[]): Promise<void> {
        const body = []

        for (const file of files) {
            const appCommand: AppCommand = (
                await import(`../${this.folder}/${file}`)
            ).default as AppCommand
            body.push(appCommand.data.toJSON())
            client.applicationCommands.set(appCommand.data.name, appCommand)
            client.logger.info(
                `LOAD - La commande ${appCommand.data.name} est chargée`
            )
        }

        const rest = new REST({ version: '10' }).setToken(
            process.env.DISCORD_TOKEN
        )

        try {
            await rest.put(
                Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
                {
                    body: body
                }
            )
            client.logger.info(`LOAD - Les commandes sont envoyées à Discord`)
        } catch (error: any) {
            client.logger.error(
                `LOAD - Lors de l'envoie des commandes à discord : ${error}`
            )
        }
    }
})
