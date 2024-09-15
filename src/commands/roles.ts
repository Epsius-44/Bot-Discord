import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  InteractionContextType,
  SlashCommandBuilder
} from "discord.js";
import AppCommand from "../class/AppCommand.js";

export default new AppCommand({
  data: new SlashCommandBuilder()
    .setName("roles")
    .setDescription("Permet d'obtenir son rôle de classe")
    .setContexts([InteractionContextType.Guild]),
  hasSubCommands: false,
  roles: [process.env.ROLE_ADMIN_ID],
  async execute(interaction): Promise<void> {
    const actionRow1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel("I1 Cyber")
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`role_cyber`),
      new ButtonBuilder()
        .setLabel("I1 SysOps")
        .setStyle(ButtonStyle.Secondary)
        .setCustomId(`role_sysops`),
      new ButtonBuilder()
        .setLabel("I1 IA")
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`role_ia`)
    );
    const actionRow2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel("I1 DevOps G1")
        .setStyle(ButtonStyle.Secondary)
        .setCustomId(`role_devops1`),
      new ButtonBuilder()
        .setLabel("I1 DevOps G2")
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`role_devops2`),
      new ButtonBuilder()
        .setLabel("I1 WIS")
        .setStyle(ButtonStyle.Secondary)
        .setCustomId(`role_wis`)
    );

    await interaction.reply({
      content:
        "Vous pouvez obtenir votre rôle de classe en cliquant sur le bouton correspondant.\n**Attention :** Vous ne pouvez avoir qu'un seul rôle de classe à la fois.",
      components: [actionRow1, actionRow2]
    });
  }
});
