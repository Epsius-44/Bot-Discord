import Handler from "../class/Handler.js";
import AppCommand from "../class/AppCommand.js";
import { Client, REST, Routes } from "discord.js";

export default new Handler({
  folder: `${process.env.APP_PATH}/commands`,
  async execute(client: Client, files: string[]): Promise<void> {
    const body = [];

    client.logger.info(`Début du chargement des commandes`, {
      labels: { job: "start" }
    });

    for (const file of files) {
      const appCommand: AppCommand = (await import(`${this.folder}/${file}`))
        .default as AppCommand;
      body.push(appCommand.data.toJSON());
      client.appCommands.set(appCommand.data.name, appCommand);
      client.logger.debug(`La commande ${appCommand.data.name} est chargée`, {
        labels: { job: "start" }
      });
    }

    client.logger.info(`Fin du chargement des commandes`, {
      labels: { job: "start" }
    });

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
      client.logger.info(`Les commandes sont envoyées à Discord`, {
        labels: { job: "start" }
      });
    } catch (error: any) {
      error.message = `Erreur lors de l'envoi des commandes à Discord : ${error.message}`;
      client.logger.error(error, { labels: { job: "start" } });
    }
  }
});
