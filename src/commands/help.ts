import {
  ApplicationCommandOptionType,
  EmbedBuilder,
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

    const embed = new EmbedBuilder()
      .setTitle("Liste des commandes utilisables")
      .setDescription(
        "Liste des commandes disponibles sur le bot auquel vous avez accès"
      )
      .setColor(0x00ff00)
      .addFields(
        commandsList.map((command) => {
          let commandDescription = command.description;
          if (showArgs) {
            commandDescription =
              command.description +
              "\n" +
              command.args
                ?.map((arg) => {
                  return (
                    "__*" +
                    arg.name +
                    "*__" +
                    (arg.required ? "" : " (falculatif)") +
                    ": " +
                    arg.description
                  );
                })
                .join("\n");
          }
          return {
            name: "/" + command.name,
            value: commandDescription
          };
        })
      );
    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  }
});
