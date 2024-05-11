import {SlashCommand} from "../types";
import {EmbedBuilder, GuildMember, SlashCommandBuilder, ToAPIApplicationCommandOptions} from "discord.js";

interface HelpCommand {
    name: string,
    description: string,
    args?: { name: string, description: string, required: boolean }[],
}

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
        .setName("help")
        .setDescription("Affiche la liste des commandes disponibles")
        .setDMPermission(false)
        .addBooleanOption(option => option
            .setName("args")
            .setDescription("Affiche les arguments des commandes")
            .setRequired(false)
        ),

    roles: [],
    execute: async (interaction) => {
        //Récupération d'informations sur le contexte de la commande
        const member = interaction.member as GuildMember;
        const getShowArgs = interaction.options.get('args');
        const showArgs = getShowArgs ? getShowArgs.value as boolean: false;
        const roles = member.roles.cache;
        //Récupération des commandes utilisables par le membre
        const commands = interaction.client.commands.filter(command => {
            if (command.roles === undefined || command.roles.length === 0) return true;
            return command.roles.some(role => roles.has(role));
        });
        //Création du tableau de commandes
        const commandsList: HelpCommand[] = [];
        commands.forEach(command => {
            if (!(command.data instanceof SlashCommandBuilder)) return;
            commandsList.push(...getCommands(command.data));
        });
        //Trier les commandes par ordre alphabétique
        commandsList.sort((a, b) => a.name.localeCompare(b.name));
        //Création de l'embed
        const embed = new EmbedBuilder()
            .setTitle("Liste des commandes disponibles")
            .setDescription(`Voici la liste des commandes de <@${interaction.client.user.id}> disponibles pour vous`)
            .setColor(0x00ff00)
            .addFields(
                commandsList.map(command => {
                    let commandDescription = command.description;
                    if (showArgs) {
                        commandDescription = command.description + "\n" + command.args.map(arg => {
                            return `- __*${arg.name}*__ ${arg.required ? "" : "(falculatif)"} : ${arg.description}`;
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
