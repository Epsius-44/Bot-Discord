import {
  LabelBuilder,
  ModalBuilder,
  RoleSelectMenuBuilder,
  TextInputBuilder,
  TextInputStyle
} from "discord.js";
import SubCommand from "../../../class/SubCommand.js";

export default new SubCommand({
  execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId("configGroupCreate")
      .setTitle("Créer un groupe de rôles")
      .addLabelComponents(
        new LabelBuilder()
          .setLabel("Nom du groupe")
          .setDescription(
            "Ce nom doit être unique, c'est ce nom qui sera affiché dans la liste des groupes."
          )
          .setTextInputComponent(
            new TextInputBuilder()
              .setCustomId("groupName")
              .setRequired(true)
              .setStyle(TextInputStyle.Short)
              .setPlaceholder("I1 - SysOps (Infra + Cyber)")
              .setMinLength(3)
              .setMaxLength(45)
          )
      )
      .addLabelComponents(
        new LabelBuilder()
          .setLabel("Identifiant du groupe")
          .setDescription(
            "Un identifiant unique pour le groupe, il est utilisé pour préfixer les salons temporaires associés."
          )
          .setTextInputComponent(
            new TextInputBuilder()
              .setCustomId("groupId")
              .setRequired(true)
              .setStyle(TextInputStyle.Short)
              .setPlaceholder("i1s")
              .setMaxLength(5)
          )
      )
      .addLabelComponents(
        new LabelBuilder()
          .setLabel("Rôles associés (max 10)")
          .setDescription("Liste des rôles membre du groupe.")
          .setRoleSelectMenuComponent(
            new RoleSelectMenuBuilder()
              .setCustomId("groupRoles")
              .setRequired(true)
              .setPlaceholder("Sélectionnez les rôles à ajouter au groupe")
              .setMinValues(1)
              .setMaxValues(10)
          )
      );
    interaction.showModal(modal);
  }
});
