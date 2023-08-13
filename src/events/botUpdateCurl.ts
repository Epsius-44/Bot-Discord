import {Client, Events} from "discord.js";
import {BotEvent} from "../types";

const event: BotEvent = {
    name: Events.ClientReady,
    once: true,
    execute(client: Client) {
        //envoyer une requête curl pour signaler que le bot a redémarré
        const url = process.env.CURL_UPDATE_URL;
        if (url) {
            //envoyer la requête curl
            const curl = async () => {
                const response = await fetch(url);
                if (response.ok){
                    client.log.info("Requête curl de redémarrage envoyée avec succès", {"type": "Curl Request", "file": __filename, "dir": __dirname});
                } else {
                    client.log.error("La requête curl de redémarrage a échoué", {"type": "Curl Request", "file": __filename, "dir": __dirname});
                }
            }
            curl();
        }
    }
}


export default event;
