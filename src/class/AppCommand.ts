import {
  MessageFlags,
  type AutocompleteInteraction,
  type ChatInputCommandInteraction,
  type ContextMenuCommandBuilder,
  type SlashCommandBuilder,
  type SlashCommandOptionsOnlyBuilder,
  type SlashCommandSubcommandsOnlyBuilder
} from "discord.js";
import type SubCommand from "./SubCommand.js";

/**
 * Représentation d'une commande d'application
 */
export default class AppCommand {
  data:
    | SlashCommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | ContextMenuCommandBuilder
    | SlashCommandSubcommandsOnlyBuilder;
  hasSubCommands?: boolean;
  execute?: (interaction: ChatInputCommandInteraction) => Promise<void> | void;
  autocomplete?: (interaction: AutocompleteInteraction) => Promise<void> | void;

  /**
   * @param {{
   *      data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | ContextMenuCommandBuilder | SlashCommandSubcommandsOnlyBuilder
   *      hasSubCommands?: boolean
   *      execute?: (interaction: ChatInputCommandInteraction) => Promise<void> | void
   *      autocomplete?: (interaction: AutocompleteInteraction) => Promise<void> | void
   *  }} options
   */
  constructor(options: {
    data:
      | SlashCommandBuilder
      | SlashCommandOptionsOnlyBuilder
      | ContextMenuCommandBuilder
      | SlashCommandSubcommandsOnlyBuilder;
    hasSubCommands?: boolean;
    execute?: (
      interaction: ChatInputCommandInteraction
    ) => Promise<void> | void;
    autocomplete?: (
      interaction: AutocompleteInteraction
    ) => Promise<void> | void;
  }) {
    if (options.hasSubCommands) {
      this.execute = async (interaction: ChatInputCommandInteraction) => {
        const subCommandGroup = interaction.options.getSubcommandGroup();
        const commandName = interaction.options.getSubcommand();

        if (!commandName) {
          await interaction.reply({
            content:
              "Je ne sais pas quelle sous-commande exécuter. Veuillez en fournir une valide.",
            flags: MessageFlags.Ephemeral
          });
          console.warn(
            `run[cmd-${interaction.commandName}]: L'utilisateur ${interaction.user.username} a tenté d'exécuter une commande mais n'a pas fourni de sous-commande.`
          );
        } else {
          try {
            const command = (
              await import(
                `../subCommands/${this.data.name}/${
                  subCommandGroup ? `${subCommandGroup}/` : ""
                }${commandName}.js`
              )
            ).default as SubCommand;
            await command.execute(interaction);
          } catch (error: any) {
            await interaction.reply({
              content:
                "Je suis désolé mais je n'arrive pas à me souvenir où j'ai laissé cette commande.",
              flags: MessageFlags.Ephemeral
            });
            console.warn(
              `run[cmd-${this.data.name}]: Une erreur s'est produite lors de l'exécution de la commande ${this.data.name} ${
                subCommandGroup ? `${subCommandGroup}/` : ""
              } ${commandName} demandée par ${interaction.user.tag} : ${error}`
            );
          }
        }
      };

      this.autocomplete = async (interaction: AutocompleteInteraction) => {
        const subCommandGroup = interaction.options.getSubcommandGroup();
        const subCommandName = interaction.options.getSubcommand();

        if (subCommandGroup || subCommandName) {
          try {
            const subCommand = (
              await import(
                `../subCommands/${this.data.name}/${
                  subCommandGroup ? `${subCommandGroup}/` : ""
                }${subCommandName}.js`
              )
            ).default as SubCommand;
            if (subCommand.autocomplete) {
              await subCommand.autocomplete(interaction);
            }
          } catch (error: any) {
            await interaction.respond([
              {
                name: "Failed to autocomplete",
                value: "error"
              }
            ]);
            error.message = `run[cmd-${this.data.name}]: Erreur lors de l'autocomplétion de ${this.data.name} ${subCommandGroup ? `${subCommandGroup}/` : ""} ${subCommandName}: ${error.message}`;
            console.warn(error);
          }
        }
      };
    } else if (options.execute) {
      this.execute = options.execute;
    } else if (options.autocomplete) {
      this.autocomplete = options.autocomplete;
    } else {
      throw new Error("No execute function provided");
    }

    this.data = options.data;
    if (!options.hasSubCommands) {
      this.autocomplete = options.autocomplete;
    }
    this.hasSubCommands = options.hasSubCommands ?? false;
  }
}
