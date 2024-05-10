import {Client, Events} from "discord.js";
import {BotEvent} from "../types";

const event: BotEvent = {
    name: Events.ClientReady,
    once: true,
    execute(client: Client) {
        client.log.info(`Le bot est disponible en tant que ${client.user.tag} (${client.user.id})`);
        if (process.env.LZLHA_IS_MASTER === 'false') {
            client.log.info('Activation du module de haute disponibilité');
            client.activeHa.start();
        } else {
            client.log.info('Le module de haute disponibilité est désactivé');
        }
    }
}

export default event;
