import { discordReply} from "../../modules/discordFunction";
import { CommandInteraction, VoiceChannel} from "discord.js";

export default async function updateAllPerms(
    interaction: CommandInteraction,
)
{
    await interaction.deferReply({ephemeral: true});
    await interaction.guild.channels.fetch()
    const salonsTemporaire= interaction.guild.channels.cache.filter((channel): channel is VoiceChannel => channel.parentId === process.env.CHANNEL_TEMP_CATEGORIE_ID && channel.id !== process.env.CHANNEL_TEMP_VOCAL_ID);
    const salonsVide = salonsTemporaire.filter((channel): channel is VoiceChannel => channel.members.size === 0);
    
    //supprimer les salons vocaux vides
    salonsVide.forEach(async (channel) => {
        await channel.delete();
    });

    //répondre à l'utilisateur
    await interaction.editReply({content: "Les salons vocaux vides ont été supprimés"})

    return true;
}
