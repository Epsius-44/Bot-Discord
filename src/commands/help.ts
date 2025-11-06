import {
  ApplicationCommandOptionType,
  ContainerBuilder,
  InteractionContextType,
  MessageFlags,
  SlashCommandBuilder,
  TextDisplayBuilder
} from "discord.js";
import AppCommand from "../class/AppCommand.js";

export interface HelpCommand {
  name: string;
  description: string;
  args?: { name: string; description: string; required: boolean }[];
}
interface CommandEntry {
  baseName: string; // root command name
  path?: string; // subcommand or subgroup/subcommand path
  description?: string;
  args?: { name: string; description: string; required: boolean }[];
}

function extractEntries(command: SlashCommandBuilder): CommandEntry[] {
  const json = command.toJSON();
  const results: CommandEntry[] = [];

  // If there are options, check for subcommand groups or subcommands
  if (json.options && json.options.length > 0) {
    // iterate over builder options (some are groups, some are subcommands)
    command.options.forEach((option) => {
      const optJson = option.toJSON();
      // Subcommand group
      if (optJson.type === ApplicationCommandOptionType.SubcommandGroup) {
        // optJson.options are the subcommands
        (optJson.options || []).forEach((sub: any) => {
          if (sub.type === ApplicationCommandOptionType.Subcommand) {
            results.push({
              baseName: json.name,
              path: `${optJson.name} ${sub.name}`,
              description: sub.description || json.description,
              args: (sub.options || []).map((o: any) => ({
                name: o.name,
                description: o.description,
                required: o.required ?? false
              }))
            });
          }
        });
      } else if (optJson.type === ApplicationCommandOptionType.Subcommand) {
        // Direct subcommand
        results.push({
          baseName: json.name,
          path: optJson.name,
          description: optJson.description || json.description,
          args: (optJson.options || []).map((o: any) => ({
            name: o.name,
            description: o.description,
            required: o.required ?? false
          }))
        });
      }
    });
  }

  // If no subcommands/subgroups found, push the base command itself
  if (results.length === 0) {
    results.push({
      baseName: json.name,
      description: json.description,
      args: (json.options || []).map((o: any) => ({
        name: o.name,
        description: o.description,
        required: o.required ?? false
      }))
    });
  }

  return results;
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
    const getShowArgs = interaction.options.get("with-args");
    const showArgs = getShowArgs ? (getShowArgs.value as boolean) : false;

    const isAdminGuild =
      !!interaction.guild &&
      interaction.guild.id === process.env.LZL_BOT_ADMIN_GUILD_ID;

    // Build entries from registered AppCommand definitions
    const entries: CommandEntry[] = [];
    interaction.client.appCommands.forEach((appCommand: AppCommand) => {
      if (!(appCommand.data instanceof SlashCommandBuilder)) return;
      // Skip private commands unless we're in admin guild
      if (appCommand.isPublic === false && !isAdminGuild) return;
      entries.push(...extractEntries(appCommand.data));
    });

    // Fetch registered commands to get IDs for mentions
    const globalCommands = interaction.client.application?.commands
      ? await interaction.client.application.commands.fetch()
      : undefined;
    const guildCommands = interaction.guild
      ? await interaction.guild.commands.fetch()
      : undefined;

    // Sort entries
    entries.sort((a, b) => {
      const na = `${a.baseName} ${a.path ?? ""}`.trim();
      const nb = `${b.baseName} ${b.path ?? ""}`.trim();
      return na.localeCompare(nb);
    });

    // Build message
    let message =
      "## Liste des commandes utilisables\nVoici la liste des commandes disponibles sur le bot auquel vous avez accès :";

    if (entries.length === 0) {
      message += "\nAucune commande n'est disponible.";
    }

    for (const entry of entries) {
      // Prefer guild command id (for admin/private commands), otherwise global
      const registered =
        (guildCommands &&
          guildCommands.find((c) => c.name === entry.baseName)) ||
        (globalCommands &&
          globalCommands.find((c) => c.name === entry.baseName));

      const label = entry.path
        ? `${entry.baseName} ${entry.path}`
        : entry.baseName;
      const mention = registered
        ? `</${label}:${registered.id}>`
        : `\`${label}\``;

      message += `\n${mention} : ${entry.description ?? ""}`;

      if (showArgs && entry.args && entry.args.length > 0) {
        entry.args.forEach((arg) => {
          message += `\n- ${arg.name} (${arg.required ? "❗" : "❔"}) : ${arg.description}`;
        });
      }
    }

    if (showArgs) {
      message += "\n\nLégende : (❗) = obligatoire, (❔) = optionnel";
    }

    await interaction.reply({
      components: [
        new ContainerBuilder().addTextDisplayComponents(
          new TextDisplayBuilder().setContent(message)
        )
      ],
      flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
    });
  }
});
