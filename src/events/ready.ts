import { Client, Events } from 'discord.js'
import Event from '../class/Event.js'

export default new Event({
    name: Events.ClientReady,
    once: true,
    execute(client: Client): void {
        client.logger.info(
            `START - Bot lancé en tant que ${client.user?.tag} !`
        )
        if (client.activeHA) {
            client.logger.info('START - Le service ActiveHA est activé !')
            void client.activeHA.start()
        } else {
            client.logger.info('START - Le service ActiveHA est désactivé !')
        }
    }
})
