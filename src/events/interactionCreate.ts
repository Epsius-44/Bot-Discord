import { BaseInteraction, Events } from 'discord.js'
import Event from '../class/Event.js'
import AppCommand from '../class/AppCommand.js'

export default new Event({
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction: BaseInteraction): Promise<void> {
        if (process.env.LZLHA_IS_MASTER === 'false') {
            interaction.client.logger.debug(
                `Ignore l'interaction ${interaction.id} de ${interaction.user.tag} car je ne suis pas le master`
            )
            return
        }

        if (!interaction.isChatInputCommand()) return

        const command: AppCommand | undefined =
            interaction.client.applicationCommands.get(interaction.commandName)

        if (!command) return

        if (!command.execute) return

        await command.execute(interaction)
        return
    }
})
