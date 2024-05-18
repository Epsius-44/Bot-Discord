import { SlashCommandBuilder } from 'discord.js'
import AppCommand from '../class/AppCommand.js'

export default new AppCommand({
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Affiche l'état du bot à un instant T")
        .setDMPermission(false),
    hasSubCommands: false,
    roles: [process.env.GUILD_ROLE_ADMIN],
    async execute(interaction): Promise<void> {
        await interaction.reply({ content: 'Pong!', ephemeral: true })
    }
})
