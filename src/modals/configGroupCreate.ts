import { MessageFlags, TextDisplayBuilder } from "discord.js";
import Modal from "../class/Modal.js";

export default new Modal({
  name: "configGroupCreate",

  execute(interaction): void {
    const groupId = interaction.fields.getTextInputValue("groupId");
    const groupName = interaction.fields.getTextInputValue("groupName");
    const groupRoles =
      interaction.fields
        .getSelectedRoles("groupRoles", true)
        ?.map((role) => role?.id) || [];
    interaction.reply({
      components: [
        new TextDisplayBuilder().setContent(
          `Cette fonctionnalité n'est pas encore implémentée. \n(Groupe: ${groupName} - ID: \`${groupId}\` - Rôles: <@&${groupRoles.join(">, <@&")}>)`
        )
      ],
      flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
    });
  }
});
