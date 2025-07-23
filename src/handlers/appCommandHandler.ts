import Handler from "../class/Handler.js";
import AppCommand from "../class/AppCommand.js";
import { Client, REST, Routes } from "discord.js";

export default new Handler({
  name: "appCommandHandler",
  folder: `${process.env.APP_PATH}/commands`,
  async execute(client: Client, files: string[]): Promise<void> {
    const body = [];

    console.info(`start[cmd]: Chargement des commandes...`);

    for (const file of files) {
      const appCommand: AppCommand = (await import(`${this.folder}/${file}`))
        .default as AppCommand;
      body.push(appCommand.data.toJSON());
      client.appCommands.set(appCommand.data.name, appCommand);
      console.debug(
        `start[cmd]: La commande ${appCommand.data.name} est chargée`
      );
    }

    const rest = new REST({ version: "10" }).setToken(
      process.env.LZL_DISCORD_TOKEN || ""
    );

    try {
      await rest.put(
        Routes.applicationCommands(process.env.LZL_DISCORD_CLIENT_ID),
        {
          body: body
        }
      );
      console.info(`start[cmd]: Envoie des commandes à Discord...`);
    } catch (error: any) {
      error.message = `start[cmd]: Erreur lors de l'envoi des commandes à Discord : ${error.message}`;
      console.error(error);
    }
  }
});
