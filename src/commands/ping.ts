import {SlashCommand} from "../types";
import {SlashCommandBuilder} from "discord.js";
// @ts-ignore
import * as ha_redis from '@luzilab.epsinyx/ha-redis';

const command: SlashCommand = {
    name: "ping",
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Test d'intéraction avec le bot"),
    execute: async (interaction) => {
        if (!ha_redis.isConnected(process.env.LZLHA_REDIS_URI)) {
            await interaction.reply("Redis is not connected");
            return;
        }
        let info = ha_redis.getClusterInfo(process.env.LZLHA_REDIS_URI);
        console.table(info);
        await interaction.reply({
            content: "Redis is connected (Voir dans les logs l'état du cluster)",
        })
    }
}

export default command;
