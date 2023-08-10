import {Modal} from "../types";

const modal: Modal = {
    name: "support",
    execute: async (interaction) => {
        //récupération des données de la modal
        const id = interaction.customId;
        const action = id.split('_')[1];
        const title = interaction.fields.getTextInputValue('titleSupport');
        const paragraph = interaction.fields.getTextInputValue('paragraphSupport');

        //TODO: envoyer les données via une requête à l'api FreshDesk

        //répondre à l'utilisateur
        await interaction.reply({
            content: 'Votre demande a bien été envoyée',
            ephemeral: true
        });
        }
    }

export default modal;