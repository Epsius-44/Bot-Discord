import {
  ApplicationCommandOptionType,
  ComponentType,
  ContainerBuilder,
  InteractionContextType,
  MessageFlags,
  SlashCommandBuilder,
  ToAPIApplicationCommandOptions
} from "discord.js";
import AppCommand from "../class/AppCommand.js";

export interface HelpCommand {
  name: string;
  description: string;
  args?: { name: string; description: string; required: boolean }[];
}

function getCommands(command: SlashCommandBuilder): HelpCommand[] {
  //vérifier si la commande possède des sous-commandes (elle possède des sous-commandes si elle possède des options avec la propriété type === 1)
  const commandJson = command.toJSON();
  const commandResult: HelpCommand[] = [];
  //vérifier si la commande possède des sous-commandes
  if (
    commandJson.options?.some(
      (option) => option.type === ApplicationCommandOptionType.Subcommand
    )
  ) {
    //si la commande possède des sous-commandes, on les récupère
    command.options.forEach((option) => {
      const subCommand = getSubcommand(option);
      if (!subCommand) return;
      subCommand.name = command.name + " " + subCommand.name;
      commandResult.push(subCommand);
    });
  } else {
    //si la commande ne possède pas de sous-commandes, on la récupère
    commandResult.push({
      name: commandJson.name,
      description: commandJson.description,
      args: commandJson.options?.map((option) => {
        return {
          name: option.name,
          description: option.description,
          required: option.required ?? false
        };
      })
    });
  }
  return commandResult;
}

function getSubcommand(
  subCommand: ToAPIApplicationCommandOptions
): HelpCommand | undefined {
  const subCommandJson = subCommand.toJSON();
  if (subCommandJson.type !== ApplicationCommandOptionType.Subcommand) return;
  return {
    name: subCommandJson.name,
    description: subCommandJson.description,
    args: subCommandJson.options?.map((option) => {
      return {
        name: option.name,
        description: option.description,
        required: option.required ?? false
      };
    })
  };
}

export default new AppCommand({
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Affiche la liste des commandes disponibles")
    .setContexts([InteractionContextType.Guild])
    //ajouter un argument pour afficher ou non les arguments des commandes (par défaut, false)
    .addBooleanOption((option) =>
      option
        .setName("with-args")
        .setDescription(
          "Afficher les arguments des commandes (par défaut, non)"
        )
    ),

  hasSubCommands: false,
  async execute(interaction): Promise<void> {
    // récupérer les commandes du bot
    const getShowArgs = interaction.options.get("with-args");
    const showArgs = getShowArgs ? (getShowArgs.value as boolean) : false;
    //récupérer les commandes pour lesquelles l'utilisateur a les permissions nécessaires pour les utiliser
    const commands = interaction.client.appCommands;
    // créer un tableau avec les commandes
    const commandsList: HelpCommand[] = [];
    commands.forEach((command: { data: SlashCommandBuilder }) => {
      if (!(command.data instanceof SlashCommandBuilder)) return;
      commandsList.push(...getCommands(command.data));
    });
    //trier les commandes par ordre alphabétique
    commandsList.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    // Construction du message de réponse
    let message =
      "## Liste des commandes utilisables\nVoici la liste des commandes disponibles sur le bot auquel vous avez accès :";
    commandsList.forEach((command) => {
      message += `\n- \`${command.name}\` ${command.description}`;
      if (showArgs && command.args) {
        if (command.args.length != 0) {
          message += "\n  Arguments :";
        }
        command.args.forEach((arg) => {
          message += `\n  - __**${arg.name}** (${arg.required ? ":exclamation:" : ":grey_question:"})__ : ${arg.description}`;
        });
      }
    });
    if (commandsList.length === 0) {
      message += "\nAucune commande n'est disponible.";
    }
    if (showArgs) {
      message +=
        "\n-# **Légende :** :exclamation: = obligatoire, :grey_question: = optionnel";
    }

    // Répondre à l'interaction avec le message formaté
    await interaction.reply({
      components: [
        new ContainerBuilder({
          components: [
            {
              content: message,
              type: ComponentType.TextDisplay
            }
          ]
        })
      ],
      flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
    });
  }
});
