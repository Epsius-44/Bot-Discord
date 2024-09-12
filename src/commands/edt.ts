import {
  APIEmbedField,
  EmbedBuilder,
  InteractionContextType,
  SlashCommandBuilder
} from "discord.js";
import AppCommand from "../class/AppCommand.js";
import { EdtElement, getDay } from "@luzilab/irori-edt";

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
        .setName("date")
        .setDescription("Date que vous souhaitez consulter (DD/MM/YYYY)")
        .setRequired(true)
    ),

  hasSubCommands: false,
  roles: [],
  async execute(interaction): Promise<void> {
    const username = interaction.options.get("username")?.value as string;
    const date = interaction.options.get("date")?.value as string;
    try {
      const edt = getDay(username, date);
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
      interaction.reply({ embeds: [embed], ephemeral: true });
    } catch {
      interaction.reply({
        content: "Erreur lors de la récupération de l'emploi du temps",
        ephemeral: true
      });
      interaction.client.logger.error(
        `Erreur dans le chargement de l'emploi du temps ${username} pour le ${date}`
      );
      return;
    }
  }
});
