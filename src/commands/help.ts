import {HelpCommand, SlashCommand} from "../types";
import {
    EmbedBuilder,
    GuildMember,
    SlashCommandBuilder,
    ToAPIApplicationCommandOptions
} from "discord.js";

function getCommands(command: SlashCommandBuilder): HelpCommand[] {
    //vérifier si la commande possède des sous-commandes (elle possède des sous-commandes si elle possède des options avec la propriété type === 1)
    const commandJson = command.toJSON();
    const commandResult: HelpCommand[] = [];
    //vérifier si la commande possède des sous-commandes
    if (commandJson.options.some(option => option.type === 1)) {
        //si la commande possède des sous-commandes, on les récupère
        command.options.forEach(option => {
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
            args: commandJson.options.map(option => {
                return {
                    name: option.name,
                    description: option.description,
                    required: option.required
                }
            })
        });
    }
    return commandResult;
}

function getSubcommand(subCommand: ToAPIApplicationCommandOptions): HelpCommand {
    const subCommandJson = subCommand.toJSON();
    if (subCommandJson.type !== 1) return;
    return {
        name: subCommandJson.name,
        description: subCommandJson.description,
        args: subCommandJson.options.map(option => {
            return {
                name: option.name,
                description: option.description,
                required: option.required
            }
        })
    }
}


const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription("Liste des commandes")
        //ajouter un argument pour afficher ou non les arguments des commandes (par défaut, false)
        .addBooleanOption(option => option
            .setName('args')
            .setDescription("Afficher les arguments des commandes (par défaut, non)"))
        .setDMPermission(false),
    execute: async (interaction) => {
        // récupérer les commandes du bot
        const member = interaction.member as GuildMember;
        const getShowArgs = interaction.options.get('args');
        const showArgs = getShowArgs ? getShowArgs.value as boolean: false;
        const roles = member.roles.cache;
        //récupérer les commandes pour lesquelles l'utilisateur a les permissions nécessaires pour les utiliser
        const commands = interaction.client.commands.filter(command => {
            if (command.roles === undefined || command.roles.length === 0) return true;
            return command.roles.some(role => roles.has(role));
        });
        // créer un tableau avec les commandes
        const commandsList: HelpCommand[] = [];
        commands.forEach(command => {
            if (!(command.data instanceof SlashCommandBuilder)) return;
            commandsList.push(...getCommands(command.data));
        });
        //trier les commandes par ordre alphabétique
        commandsList.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });

        const embed = new EmbedBuilder()
            .setTitle("Liste des commandes")
            .setDescription("Liste des commandes disponibles sur le bot auquel vous avez accès")
            .setColor(0x00ff00)
            .addFields(
                commandsList.map(command => {
                    let commandDescription = command.description;
                    if (showArgs) {
                        commandDescription = command.description + "\n" + command.args.map(arg => {
                            return "__*" + arg.name + "*__" + (arg.required ? "" : " (falculatif)") + ": " + arg.description;
                        }).join("\n");
                    }
                        return {
                            name: "/" + command.name,
                            value: commandDescription
                        }
                    }
                )
            );

        await interaction.reply({embeds: [embed], ephemeral: true});
    }
}

export default command;
