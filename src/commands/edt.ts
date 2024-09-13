import {
  APIEmbedField,
  EmbedBuilder,
  InteractionContextType,
  SlashCommandBuilder
} from "discord.js";
import AppCommand from "../class/AppCommand.js";
import { EdtElement, getDay, getDays } from "@luzilab/irori-edt";

function formatDay(
  edt: EdtElement[],
  username: string,
  date: string
): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setTitle(`Emploi du temps de ${username} - ${date}`)
    .setDescription(
      `Récupération: <t:${Math.floor(new Date().getTime() / 1000)}:D>\n :warning: Cette commande ne gère pas les salles multiples et en affiche qu'une :warning:`
    )
    .setColor(0x0099ff);
  const fields: APIEmbedField[] = [];
  edt.forEach((element: EdtElement) => {
    fields.push({
      name: `${element.name}`,
      value: `- :clock8: ${element.start_time} - ${element.end_time}\n- :school: ${element.room == "NS" ? "???" : element.room}\n- :teacher: ${element.teacher == "" ? "???" : element.teacher}`
    });
  });
  embed.addFields(fields);
  return embed;
}

function formatDays(
  edt: EdtElement[][],
  username: string,
  start_date: string,
  end_date: string
): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setTitle(`Emploi du temps de ${username} - ${start_date} à ${end_date}`)
    .setDescription(
      `Récupération: <t:${Math.floor(new Date().getTime() / 1000)}:D>\n :warning: Cette commande ne gère pas les salles multiples et en affiche qu'une :warning:`
    )
    .setColor(0x0099ff);
  const fields: APIEmbedField[] = [];
  edt.forEach((day: EdtElement[]) => {
    let day_edt = "";
    day.forEach((element: EdtElement) => {
      day_edt += `:clock8: \`${element.start_time} - ${element.end_time}\` | :book: ${element.name} :school: ${element.room == "NS" ? "???" : element.room} :teacher: ${element.teacher == "" ? "???" : element.teacher}\n`;
    });
    fields.push({
      name: `${day[0].date}`,
      value: day_edt
    });
  });
  embed.addFields(fields);
  return embed;
}

export default new AppCommand({
  data: new SlashCommandBuilder()
    .setName("edt")
    .setDescription("Affiche l'emploi du temps sur une journée")
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.BotDM,
      InteractionContextType.PrivateChannel
    ])
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription(
          "Identifiant utilisateur (partie précédant le @ dans l'email école)"
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("start_date")
        .setDescription(
          "Première date que vous souhaitez consulter (DD/MM/YYYY)"
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("end_date")
        .setDescription(
          "Dernière date que vous souhaitez consulter (DD/MM/YYYY)"
        )
        .setRequired(false)
    ),

  hasSubCommands: false,
  roles: [],
  async execute(interaction): Promise<void> {
    const username = interaction.options.get("username")?.value as string;
    const start_date = interaction.options.get("start_date")?.value as string;
    const end_date = interaction.options.get("end_date")?.value as string;
    try {
      let embed: EmbedBuilder = new EmbedBuilder();
      if (end_date === undefined) {
        const edt = getDay(username, start_date);
        embed = formatDay(edt, username, start_date);
      } else {
        const edt = getDays(username, start_date, end_date);
        embed = formatDays(edt, username, start_date, end_date);
      }
      interaction.reply({ embeds: [embed], ephemeral: true });
    } catch {
      interaction.reply({
        content: "Erreur lors de la récupération de l'emploi du temps",
        ephemeral: true
      });
      interaction.client.logger.error(
        `Erreur dans le chargement de l'emploi du temps ${username} pour ${start_date} à ${end_date}`
      );
      return;
    }
  }
});
