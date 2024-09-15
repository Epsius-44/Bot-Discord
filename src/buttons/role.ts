import { ButtonInteraction } from "discord.js";
import Button from "../class/Button.js";

export default new Button({
  name: "role",

  async execute(interaction: ButtonInteraction): Promise<void> {
    // TODO: Rendre les rôles et les actions dynamiques
    const ROLES = [
      "1284485001278259260",
      "1284484894386294865",
      "1284484627729219666",
      "1284484770708848676",
      "1284484492412719147",
      "1284484307142053914"
    ];
    const ACTIONS = ["cyber", "sysops", "devops1", "devops2", "ia", "wis"];
    const user = await interaction.guild?.members.fetch(interaction.user.id);
    if (!user) {
      interaction.client.logger.error(
        `interaction - Membre introuvable : ${interaction.user.id}`
      );
      interaction.reply({
        content: "Je ne me souviens pas de toi !",
        ephemeral: true
      });
      return;
    }
    const action = interaction.customId.split("_")[1];
    let check = false;
    user.roles.cache.forEach((role) => {
      if (ROLES.includes(role.id as string)) {
        check = true;
        return interaction.reply({
          content: `${user} vous avez déjà le role de classe \`${role.name}\`, nous ne pouvons pas vous donner aussi le role <@&${ROLES[ACTIONS.indexOf(action)]}>\nSi vous avez des questions, n'hésitez pas à demander à un membre du staff.`,
          ephemeral: true
        });
      }
    });
    if (check) return;
    await user.roles.add([ROLES[ACTIONS.indexOf(action)].toString()]);
    await interaction.reply({
      content: `${user}, le role de la classe \`${action}\` viens d'être ajouté !`,
      ephemeral: true
    });
  }
});
