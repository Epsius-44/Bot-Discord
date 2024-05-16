/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import Handler from '../class/Handler.js'
import Event from '../class/Event.js'
import { Client } from 'discord.js'

export default new Handler({
    folder: './events',
    async execute(client: Client, files: string[]): Promise<void> {
        for (const file of files) {
            const event: Event = (await import(`../events/${file}`))
                .default as Event
            if (event.once) {
                client.once(
                    event.name,
                    (...args) => void event.execute(...args)
                )
            } else {
                client.on(event.name, (...args) => void event.execute(...args))
            }
            client.logger.info(`LOAD - L'évènement ${event.name} est chargé`)
        }
    }
})
