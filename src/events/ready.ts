import {Client, Events, ActivityType} from "discord.js";
import {BotEvent} from "../types";

const event: BotEvent = {
    name: Events.ClientReady,
    once: true,
    execute(client: Client) {
        client.log.info(`Le bot est disponible en tant que ${client.user.tag} (${client.user.id})`, {"type": "Bot Ready", "file": __filename, "dir": __dirname});
        client.user.setActivity(`Version: ${process.env.npm_package_version}`, { type: ActivityType.Custom });
    }
}

export default event;
