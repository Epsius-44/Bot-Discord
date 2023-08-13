import {Client, Events} from "discord.js";
import {BotEvent} from "../types";

const event: BotEvent = {
    name: Events.ClientReady,
    once: true,
    execute(client: Client) {
        //envoyer une requête curl pour signaler que le bot a redémarré
        const url = process.env.CURL_PING_URL;
        const delay = process.env.CURL_PING_INTERVAL; //en secondes
        const delayNumber = Number(delay);
        if (url) {
            //envoyer la requête curl
            const curl = async () => {
                const response = await fetch(url);
                if (response.ok){
                    client.log.info("Requête curl de ping envoyée avec succès", {"type": "Curl Request", "file": __filename, "dir": __dirname});
                } else {
                    client.log.error("La requête curl de ping a échoué", {"type": "Curl Request", "file": __filename, "dir": __dirname});
                }
            }
            setInterval(curl, delayNumber * 1000);
        }
    }
}


export default event;
