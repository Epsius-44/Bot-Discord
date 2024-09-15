import Handler from "../class/Handler.js";
import AppCommand from "../class/AppCommand.js";
import { Client, REST, Routes } from "discord.js";

export default new Handler({
  folder: `${process.env.APP_PATH}/commands`,
  async execute(client: Client, files: string[]): Promise<void> {
    const body = [];

    client.logger.info(`command - Début du chargement des commandes`);

    for (const file of files) {
      const appCommand: AppCommand = (await import(`${this.folder}/${file}`))
        .default as AppCommand;
      body.push(appCommand.data.toJSON());
      client.appCommands.set(appCommand.data.name, appCommand);
      client.logger.debug(
        `command - La commande ${appCommand.data.name} est chargée`
      );
    }

    client.logger.info(`command - Fin du chargement des commandes`);

    const rest = new REST({ version: "10" }).setToken(
      process.env.DISCORD_TOKEN
    );

    try {
      await rest.put(
        Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
        {
          body: body
        }
      );
      client.logger.info(`command - Les commandes sont envoyées à Discord`);
    } catch (error: any) {
      client.logger.error(
        `command - Lors de l'envoie des commandes à discord : ${error}`
      );
    }
  }
});
