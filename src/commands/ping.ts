import {InstanceInfo, SlashCommand} from "../types";
import {EmbedBuilder, PermissionsBitField, SlashCommandBuilder} from "discord.js";
// @ts-ignore
import * as ha_redis from "@luzilab.epsinyx/ha-redis";
import * as packageData from "../../package.json";

const command: SlashCommand = {
    name: "ping",
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Affiche l'état du bot à un instant T")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers)
        .setDMPermission(false),
    execute: async (interaction) => {
        const versionEmbed = new EmbedBuilder()
            .setTitle("Version et dépendances du bot")
            .setDescription(`Le bot actif est en version \`${packageData.version}\``)
        for (let dep in packageData.dependencies) {
            versionEmbed.addFields({
                name: `${dep}`,
                value: `[${packageData.dependencies[dep]}](<https://www.npmjs.com/package/${dep}>)`,
                inline: true
            })
        }
        const bddEmbed = new EmbedBuilder()
            .setTitle("Base de données")
            .setDescription("__**Pas encore en place**__")
        const haEmbed = new EmbedBuilder()
            .setTitle("Haute disponibilité")
        if (interaction.client.activeHa) {
            if (!ha_redis.isConnected(process.env.LZLHA_REDIS_URI)) {
                haEmbed.setDescription("La connexion à la base de données de haute disponibilité est impossible")
            } else {
                haEmbed.setDescription("Le module de haute disponibilité est activé")
                let clusterInfo: InstanceInfo[] = ha_redis.getClusterInfo(process.env.LZLHA_REDIS_URI)
                for (let instanceInfo of clusterInfo) {
                    haEmbed.addFields({
                        name: `Instance ${instanceInfo.id} : ${instanceInfo.name}`,
                        value: `- Version du bot : \`${instanceInfo.botVersion}\`\n` +
                            `- Version de NodeJS : \`${instanceInfo.nodeVersion}\`\n` +
                            `- En ligne : ${instanceInfo.isOnline ? ":white_check_mark:" : ":x:"}\n` +
                            `- Maître : ${instanceInfo.isMaster ? ":white_check_mark:" : ":x:"}`,
                        inline: true
                    })
                }
            }
        } else {
            haEmbed.setDescription("Le module de haute disponibilité est désactivé")
        }
        await interaction.reply({
            content: "Pong ! Voici les informations sur l'état du bot",
            ephemeral: true,
            embeds: [
                versionEmbed,
                bddEmbed,
                haEmbed
            ]
        });
    }
}

export default command;
