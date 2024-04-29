import {IEdtEpsiJS, SlashCommand} from "../types";
import {EmbedBuilder, SlashCommandBuilder} from "discord.js";
import {discordReply} from "../modules/discordFunction";
import {getEdtEpsi} from "../modules/edt";

const date_command = new Date();
const day_command = date_command.getDate();
const day_string = day_command < 10 ? `0${day_command}` : day_command.toString()
const month_command = date_command.getMonth() + 1;
const month_string = month_command < 10 ? `0${month_command}` : month_command.toString()
const year_command = date_command.getFullYear();

const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('edt')
        .setDescription("Afficher l'emploi du temps")
        .addStringOption(option => option.setName('identifiant')
            .setDescription("Votre identifiant (ex: jean.dupont)")
            .setRequired(true))
        .addStringOption(option => option.setName('date')
            .setDescription(`La date de l'emploi du temps (ex: ${day_string}/${month_string}/${year_command} ou ${day_string}-${month_string}-${day_command}) (Par défaut: date du jour)`)
            .setRequired(false))
        .setDMPermission(true),
    execute: async (interaction) => {
        const identifiant = interaction.options.get('identifiant').value.toString().toLowerCase();
        let dateInput = interaction.options.get('date');
        const today = new Date();
        let dateString = dateInput ? dateInput.value.toString() : `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

        //vérifier le format de la date
        const dateRegex = /^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/;

        const match = dateString.match(dateRegex);
        if (!match) {
            await discordReply(interaction, "Le format de la date est invalide !");
            return;
        }

        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10);
        const year = parseInt(match[3], 10);

        // Créer un objet Date
        const date = new Date(year, month - 1, day);
        if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
            await discordReply(interaction, "La date est invalide !");
            return;
        }

        //vérifier le format de l'identifiant (ex: jean.dupont) -> regex
        const identifiantRegex = /^[a-z]+\.[a-z]+$/;
        if (!identifiant.match(identifiantRegex)) {
            await discordReply(interaction, "Le format de l'identifiant est invalide !");
            return;
        }

        await interaction.deferReply({ephemeral: true});
        //faire la requête à l'API avec l'identifiant et la date
        let response: void | IEdtEpsiJS[];
        const timeoutMs = process.env.TIMEOUT_MS_EDT ? parseInt(process.env.TIMEOUT_MS_EDT) : 30000;
        response = await getEdtEpsi(identifiant, date, timeoutMs)
            .catch(async (error) => {
                if (error.message === 'Timeout reached') {
                    await interaction.editReply({content: "L'emploi du temps met trop de temps à répondre !"});
                    return;
                }
                await interaction.editReply({content: 'Une erreur est survenue lors de la récupération de l\'emploi du temps !'});
                return;
            });


        if (!response) {
            return;
        }

        const identifiantSplit = identifiant.split('.');
        identifiantSplit[0] = identifiantSplit[0].charAt(0).toUpperCase() + identifiantSplit[0].slice(1);
        identifiantSplit[1] = identifiantSplit[1].charAt(0).toUpperCase() + identifiantSplit[1].slice(1);

        const date_month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
        const date_day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
        //récupérer la réponse et l'afficher
        const embed = new EmbedBuilder()
            .setTitle(`Emploi du temps de ${identifiantSplit[0]} ${identifiantSplit[1]}`)
            .setURL(`https://ws-edt-cd.wigorservices.net/WebPsDyn.aspx?action=posEDTLMS&serverid=C&Tel=${identifiant}&date=${date_month}/${date_day}/${date.getFullYear()}`)
            .setDescription(`Date: <t:${Math.floor(date.getTime() / 1000)}:D>\n :warning: Cette commande ne gère pas les salles multiples et en affiche qu'une :warning:`)
            .setThumbnail('https://cdn.icon-icons.com/icons2/317/PNG/512/calendar-clock-icon_34472.png')
            .setColor(0x0099ff);

        const fields = [];
        response.forEach((cours) => {
            fields.push({
                name: `${cours.start_hour} - ${cours.end_hour} : ${cours.name}`,
                value: `:teacher: : ${cours.teacher}\n:school: : ${cours.room}`,
                inline: false
            });
        });
        date.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        if (fields.length === 0) {
            fields.push({
                name: "Aucun cours",
                //Affiché un message si aucun cours en fonction de si la date est passée, présente ou future en fonction de la date du jour. Ne pas prendre en compte les heures
                value: date < today ? "Vous n'avez pas eu cours ce jour là !" : date > today ? "Vous n'avez pas de cours prévu ce jour là ! (pour l'instant)" : "Vous n'avez pas cours aujourd'hui !",
                inline: false
            });
        }
        embed.addFields(fields);
        await interaction.editReply({embeds: [embed]});
    }
}

export default command;
