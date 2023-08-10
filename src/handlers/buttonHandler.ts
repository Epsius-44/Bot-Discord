import {Client} from "discord.js";
import {join} from "path";
import {readdirSync} from "fs";
import {ButtonActionMessage} from "../types";

module.exports = async (client: Client) => {
    //button handler
    let buttonsDirs = join(__dirname, '../buttons');

    readdirSync(buttonsDirs).forEach(file => {
        if (!file.endsWith('.js')) return;
        const button: ButtonActionMessage = require(`${buttonsDirs}/${file}`).default;

        client.buttons.set(button.name, button);
        client.log.debug(`Le bouton ${button.name} est chargé (${buttonsDirs}/${file})`, {
            "type": "Local Load",
            "file": __filename
        })
    });
}
