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
  const commandJson = command.toJSON();
  const commandResult: HelpCommand[] = [];

  // Vérifier si la commande possède des sous-commandes ou des groupes de sous-commandes
  const hasSubCommands = commandJson.options?.some(
    (option) => option.type === ApplicationCommandOptionType.Subcommand
  );
  const hasSubCommandGroups = commandJson.options?.some(
    (option) => option.type === ApplicationCommandOptionType.SubcommandGroup
  );

  if (hasSubCommands || hasSubCommandGroups) {
    // Si la commande possède des sous-commandes ou des groupes, on les traite
    command.options.forEach((option) => {
      const optionJson = option.toJSON();

      if (optionJson.type === ApplicationCommandOptionType.SubcommandGroup) {
        // Traiter les groupes de sous-commandes
        const subCommandGroup = getSubcommandGroup(option, command.name);
        commandResult.push(...subCommandGroup);
      } else if (optionJson.type === ApplicationCommandOptionType.Subcommand) {
        // Traiter les sous-commandes directes
        const subCommand = getSubcommand(option);
        if (!subCommand) return;
        subCommand.name = command.name + " " + subCommand.name;
        commandResult.push(subCommand);
      }
    });
  } else {
    // Si la commande ne possède pas de sous-commandes, on la récupère
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

function getSubcommandGroup(
  subCommandGroup: ToAPIApplicationCommandOptions,
  commandName: string
): HelpCommand[] {
  const subCommandGroupJson = subCommandGroup.toJSON();
  const result: HelpCommand[] = [];

  if (subCommandGroupJson.type !== ApplicationCommandOptionType.SubcommandGroup)
    return result;

  // Parcourir toutes les sous-commandes dans le groupe
  subCommandGroupJson.options?.forEach((option) => {
    if (option.type === ApplicationCommandOptionType.Subcommand) {
      const subCommand: HelpCommand = {
        name: `${commandName} ${subCommandGroupJson.name} ${option.name}`,
        description: option.description,
        args: option.options?.map((arg) => {
          return {
            name: arg.name,
            description: arg.description,
            required: arg.required ?? false
          };
        })
      };
      result.push(subCommand);
    }
  });

  return result;
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
