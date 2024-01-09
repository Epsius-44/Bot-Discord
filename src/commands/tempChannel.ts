import {SlashCommand} from "../types";
import {
    ButtonStyle,
    ChannelType,
    ComponentType,
    OverwriteType,
    PermissionFlagsBits,
    PermissionsBitField,
    SlashCommandBuilder,
    TextChannel
} from "discord.js";
import {discordReply, getCommandMemberAsGuildMember} from "../modules/discordFunction";
import addIntervenant from "./tempChannel/addIntervenant";
import deleteTempChannel from "./tempChannel/delete";
import renameTempChannel from "./tempChannel/rename";
import archiveTempChannel from "./tempChannel/archive";
import addTempChannel from "./tempChannel/add";
import cleanVoiceChannel from "./tempChannel/cleanVoiceChannel";


const categorie_id = process.env.CHANNEL_TEMP_CATEGORIE_ID;
// exemple de json récupéré depuis le .env: [{"name": "test", "role_id": "123456789", "tag": "test"}]
const choices = JSON.parse(process.env.CLASSROOM_LIST || "[]") as { name: string, role_id: string, tag: string }[];
// transforme le tableau en tableau de choix pour les options
// const choicesOptions = choices.map(({name, role_id}) => {
//     return {name: name, value: role_id.toString()}
//
// });

const command: SlashCommand = {
    roles: [process.env.ROLE_ADMIN_ID, process.env.ROLE_RESPONSABLE_ID],
    data: new SlashCommandBuilder()
        .setName('temp_channel')
        .setDescription("Gérer les salons temporaires")
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription("Créer un salon temporaire")
                .addStringOption(option => option
                    .setName('module')
                    .setDescription("Nom du salon temporaire")
                    .setRequired(true)
                )
                .addStringOption(option => option
                    .setName('groupe')
                    .setDescription("Groupe du salon temporaire")
                    .setRequired(true)
                    // .addChoices(
                    //     ...choicesOptions
                    // )
                    .setAutocomplete(true)
                ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('archive')
                .setDescription("Archiver un salon temporaire")
                .addStringOption(option => option
                    .setName('salon')
                    .setDescription("Salon temporaire à archiver (laissé vide pour archiver ce salon)")
                    .setAutocomplete(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('rename')
                .setDescription("Renommer un salon temporaire")
                .addStringOption(option => option
                    .setName('nom')
                    .setDescription("Nouveau nom du salon temporaire")
                    .setRequired(true)
                )
                .addStringOption(option => option
                    .setName('salon')
                    .setDescription("Salon temporaire à renommer (laissé vide pour renommer ce salon)")
                    .setAutocomplete(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription("Demander la suppression d'un salon temporaire")
                .addStringOption(option => option
                    .setName('raison')
                    .setDescription("Raison de la suppression")
                    .setRequired(true)
                )
                .addStringOption(option => option
                    .setName('salon')
                    .setDescription("Salon temporaire à supprimer (laissé vide pour supprimé ce salon)")
                    .setAutocomplete(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('add_intervenant')
                .setDescription("Ajouter un intervenant à un salon temporaire")
                .addUserOption(option => option
                    .setName('intervenant')
                    .setDescription("Intervenant à ajouter")
                    .setRequired(true))
                .addStringOption(option => option
                    .setName('salon')
                    .setDescription("Salon temporaire auquel ajouté l'intervenant")
                    .setAutocomplete(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('clean_voice_channel')
                .setDescription("Supprime les salons vocaux vides s'ils n'ont pas été supprimés automatiquement"))
        // la commande ne peut pas être utilisée en DM
        .setDMPermission(false),

    autocomplete: async (interaction) => {
        const focusedOption = interaction.options.getFocused(true);
        if (!focusedOption) return;

        if (focusedOption.name == "salon") {
            //récupérer la liste des salons temporaires
            const temp_channels = interaction.guild?.channels.cache.filter(channel => channel.parentId == categorie_id && channel.type == ChannelType.GuildText);
            if (!temp_channels) return;
            //filtrer les salons temporaires pour ne garder que ceux qui contiennent une partie du nom donné par l'utilisateur (remplacer les espaces par des tirets)
            const filtered_channels = temp_channels.filter(channel => channel.name.toLowerCase().includes(interaction.options.getString('salon')?.toLowerCase()?.replace(/ /g, "_") || ""));
            //transformer les salons filtrés en tableau de choix
            const choices = filtered_channels.map(channel => {
                return {name: channel.name, value: channel.id}
            });
            //renvoyer les choix à l'utilisateur
            await interaction.respond(choices);
        } else if (focusedOption.name == "groupe") {
            //récupérer la liste des groupes auquel appartient l'utilisateur et qui sont dans choices
            const member = getCommandMemberAsGuildMember(interaction);
            const member_roles = member.roles.cache.filter(role => choices.some(choice => choice.role_id == role.id));
            //transformer les groupes en tableau de choix
            const choices_autocompletion_groupes = member_roles.map(role => {
                return {name: role.name, value: role.id}
            });

            //renvoyer les choix à l'utilisateur
            await interaction.respond(choices_autocompletion_groupes);
        }

    },

    execute: async (interaction) => {

        const subcommand = interaction.isChatInputCommand() ? interaction.options.getSubcommand() : null;
        const member = getCommandMemberAsGuildMember(interaction);
        const role_admin = interaction.guild?.roles.cache.get(process.env.ROLE_ADMIN_ID);
        //si un salon est donné en option, le récupérer, sinon récupérer le salon dans lequel la commande a été utilisée
        const channel_select_get = interaction.options.get('salon');
        //obtenir la liste des salons temporaires auquel l'utilisateur a accès (regarder les salons auquel il a la permission de voir)
        const temp_channels = interaction.guild?.channels.cache.filter(channel => channel.parentId == categorie_id && channel.type == ChannelType.GuildText && member.permissionsIn(channel).has(PermissionsBitField.Flags.ViewChannel));
        //vérifié qie le salon existe et qu'il est bien un salon temporaire
        let channel_select_option: TextChannel = interaction.channel as TextChannel;

        if (subcommand != "add" && subcommand != "update_all_perms" && subcommand != "clean_voice_channel") {
            //vérifier si un salon a été donné en option et qu'il est accessible à l'utilisateur
            if (channel_select_get && temp_channels?.has(channel_select_get.value.toString())) {
                channel_select_option = interaction.guild?.channels.cache.get(channel_select_get.value.toString()) as TextChannel;
            } else if (!temp_channels?.has(channel_select_option.id)) {
                await discordReply(interaction, "Vous n'avez pas la permission d'utiliser cette commande dans ce salon");
                return;
            } else if (channel_select_get) {
                await discordReply(interaction, "Veuillez sélectionner un salon temporaire valide ou laisser le champ vide pour sélectionner le salon dans lequel la commande est utilisée (uniquement dans un salon temporaire)");
                return;
            }
            if (!channel_select_option) return;
        }

        switch (subcommand) {
            case "add":
                await addTempChannel(interaction, choices, categorie_id, member);
                break;

            case "archive":
                await archiveTempChannel(interaction, channel_select_option, categorie_id, member);
                break;

            case "rename":
                await renameTempChannel(interaction, channel_select_option, categorie_id, member);
                break;

            case "delete":
                await deleteTempChannel(interaction, channel_select_option, member);
                break;

            case "add_intervenant":
                await addIntervenant(interaction, channel_select_option, categorie_id);
                break;
            // TODO: A retirer dans la prochaine version mineure (1.3.1 -> 1.4.0) permet de gérer le décommissionnement d'une sous commande
            case "update_all_perms":
                await interaction.reply({content: "Commande désactivée, voir avec l'admin en cas de besoin", ephemeral: true})

            case "clean_voice_channel":
                await cleanVoiceChannel(interaction)
                break;
        }
    }
}

export default command;
