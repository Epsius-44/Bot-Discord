import Handler from "../class/Handler.js";
import AppCommand from "../class/AppCommand.js";
import { Client, REST, Routes } from "discord.js";

export default new Handler({
  name: "appCommandHandler",
  folder: `${process.env.APP_PATH}/commands`,
  async execute(client: Client, files: string[]): Promise<void> {
    const body = [];

    client.logManager.logger.info(`Chargement des commandes...`, {
      status: "starting",
      category: "commands"
    });

    for (const file of files) {
      const appCommand: AppCommand = (await import(`${this.folder}/${file}`))
        .default as AppCommand;
      client.logManager.logger.verbose(
        `Chargement de la commande ${appCommand.data.name}...`,
        {
          status: "starting",
          category: `commands-${appCommand.data.name}`
        }
      );
      body.push(appCommand.data.toJSON());
      client.appCommands.set(appCommand.data.name, appCommand);
      client.logManager.logger.debug(
        `La commande ${appCommand.data.name} est chargée`,
        {
          status: "starting",
          category: `commands-${appCommand.data.name}`
        }
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
      client.logManager.logger.info(`Envoie des commandes à Discord...`, {
        status: "starting",
        category: "discord-commands"
      });
    } catch (error: any) {
      error.message = `Erreur lors de l'envoi des commandes à Discord : ${error.message}`;
      client.logManager.logger.error(error.message, {
        status: "starting",
        category: "discord-commands"
      });
    }
  }
});
