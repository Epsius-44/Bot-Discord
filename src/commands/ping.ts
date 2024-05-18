import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import AppCommand from '../class/AppCommand.js'
import packageInfo from '../../package.json' assert { type: 'json' }

export default new AppCommand({
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Affiche l'état du bot à un instant T")
        .setDMPermission(false),
    hasSubCommands: false,
    roles: [process.env.GUILD_ROLE_ADMIN],
    async execute(interaction): Promise<void> {
        const versionEmbed = new EmbedBuilder()
            .setTitle('Version et dépendances du bot')
            .setDescription(
                `Le bot actif est en version \`${packageInfo.version}\``
            )
        for (const dep in packageInfo.dependencies) {
            versionEmbed.addFields({
                name: `${dep}`,
                // @ts-expect-error TS7053
                value: `[${packageInfo.dependencies[dep]}](<https://www.npmjs.com/package/${dep}>)`,
                inline: true
            })
        }

        const bddEmbed = new EmbedBuilder()
            .setTitle('Base de données')
            .setDescription('__**Pas encore en place**__')

        const haEmbed = new EmbedBuilder().setTitle('Haute disponibilité')
        if (!interaction.client.activeHA) {
            haEmbed.setDescription(
                "Le module de haute disponibilité n'est pas actif"
            )
        } else if (!interaction.client.activeHA.isConnected()) {
            haEmbed.setDescription(
                "Le module de haute disponibilité n'est pas connecté à Redis"
            )
        } else {
            haEmbed.setDescription(
                'Le module de haute disponibilité est activé'
            )
            const clusterInfo = interaction.client.activeHA.getClusterInfo()
            for (const instance of clusterInfo) {
                haEmbed.addFields({
                    name: `Instance ${instance.id} : ${instance.name}`,
                    value:
                        `- Version du bot : \`${instance.botVersion}\`\n` +
                        `- Version de Node.js : \`${instance.nodeVersion}\`\n` +
                        `- En ligne : ${instance.isOnline ? ':white_check_mark:' : ':x:'}\n` +
                        `- Maître : ${instance.isMaster ? ':white_check_mark:' : ':x:'}`,
                    inline: true
                })
            }
        }

        await interaction.reply({
            content: "Pong ! Voici les informations sur l'état du bot",
            ephemeral: true,
            embeds: [versionEmbed, bddEmbed, haEmbed]
        })
    }
})
