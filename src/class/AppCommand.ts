import {
  MessageFlags,
  TextDisplayBuilder,
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
  isPublic?: boolean;
  execute?: (interaction: ChatInputCommandInteraction) => Promise<void> | void;
  autocomplete?: (interaction: AutocompleteInteraction) => Promise<void> | void;

  /**
   * @param {{
   *      data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | ContextMenuCommandBuilder | SlashCommandSubcommandsOnlyBuilder
   *      hasSubCommands?: boolean
   *      isPublic?: boolean
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
    isPublic?: boolean;
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
            components: [
              new TextDisplayBuilder().setContent(
                "Je ne sais pas quelle sous-commande exécuter. Veuillez en fournir une valide."
              )
            ],
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
          });
          interaction.client.logManager.logger.warn(
            `Activation de la commande ${interaction.commandName} par ${interaction.user.id} sans fournir de sous-commande.`,
            {
              status: "ready",
              category: "appCommand-subCommand",
              metadata: {
                interactionType: interaction.type,
                command: interaction.commandName,
                options: interaction.options?.data ?? [],
                user: interaction.user.id,
                guild: interaction.guild?.id
              }
            }
          );
        } else {
          try {
            const command = (
              await import(
                `../commands/${this.data.name}/${
                  subCommandGroup ? `${subCommandGroup}/` : ""
                }${commandName}.js`
              )
            ).default as SubCommand;
            await command.execute(interaction);
          } catch (error: any) {
            console.error(error);
            await interaction.reply({
              components: [
                new TextDisplayBuilder().setContent(
                  "Je suis désolé, mais je n'ai pas pu exécuter cette sous-commande."
                )
              ],
              flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
            });
            interaction.client.logManager.logger.warn(
              `Activation de la commande ${this.data.name} ${
                subCommandGroup ? `${subCommandGroup}/` : ""
              }${commandName} par ${interaction.user.id} avec une erreur : ${error}`,
              {
                status: "ready",
                category: "appCommand-subCommand",
                metadata: {
                  interactionType: interaction.type,
                  command: `${this.data.name} ${subCommandGroup ? `${subCommandGroup}/` : ""}${commandName}`,
                  options: interaction.options?.data ?? [],
                  user: interaction.user.id,
                  guild: interaction.guild?.id
                }
              }
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
                `../commands/${this.data.name}/${
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
            error.message = `Activation de la commande ${this.data.name} ${subCommandGroup ? `${subCommandGroup}/` : ""} ${subCommandName} par ${interaction.user.id} avec une erreur d'autocomplétion : ${error.message}`;
            interaction.client.logManager.logger.warn(error.message, {
              status: "ready",
              category: "appCommand-subCommand",
              metadata: {
                interactionType: interaction.type,
                command: `${this.data.name} ${subCommandGroup ? `${subCommandGroup}/` : ""}${subCommandName}`,
                options: interaction.options?.data ?? [],
                user: interaction.user.id,
                guild: interaction.guild?.id
              }
            });
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
    this.isPublic = options.isPublic ?? true;
  }
}
