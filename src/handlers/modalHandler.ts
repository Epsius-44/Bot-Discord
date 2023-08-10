import {Client} from "discord.js";
import {join} from "path";
import {readdirSync} from "fs";
import {Modal} from "../types";

module.exports = async (client: Client) => {
    //button handler
    let modalsDirs = join(__dirname, '../modals');

    readdirSync(modalsDirs).forEach(file => {
        if (!file.endsWith('.js')) return;
        const modal: Modal = require(`${modalsDirs}/${file}`).default;

        client.modals.set(modal.name, modal);
        client.log.debug(`La modal ${modal.name} est chargée (${modalsDirs}/${file})`, {
            "type": "Local Load",
            "file": __filename
        })
    });
}
