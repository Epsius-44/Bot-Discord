import {Client, Events} from "discord.js";
import {BotEvent} from "../types";

const event: BotEvent = {
    name: Events.ClientReady,
    once: true,
    execute(client: Client) {
        client.log.info(`Le bot est disponible en tant que ${client.user.tag} (${client.user.id})`, {"type": "Bot Ready", "file": __filename, "dir": __dirname});
    }
}

export default event;
