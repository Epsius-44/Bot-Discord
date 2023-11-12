import {ButtonActionMessage} from "../types";

const command: ButtonActionMessage = {
    name: "role",
    execute: async (interaction) => {
        const ROLES = ["1173259758065700985", "1173259950240309248", "1173260048856776787", "1173260123507015750", "1173260197679091792"];
        const ACTIONS = ['asrbd', 'cda1', 'cda2', 'ia', 'wis'];
        const user = await interaction.guild.members.fetch(interaction.user.id);
        const action = interaction.customId.split('_')[1];
        let check = false;
        user.roles.cache.forEach(role => {
            if (ROLES.includes(<string>role.id)) {
                check = true;
                return interaction.reply({
                    content: `${user} vous avez déjà le role \`${role.name}\` de spécialité, nous ne pouvons pas vous donner aussi le role <@&${ROLES[ACTIONS.indexOf(action)]}>`,
                    ephemeral: true
                });
            }
        });
        if (check) return;
        await user.roles.add([ROLES[ACTIONS.indexOf(action)].toString()]);
        await interaction.reply({content: `${user}, le role \`${action}\` viens d'être ajouté !`, ephemeral: true});
    }
}

export default command;
