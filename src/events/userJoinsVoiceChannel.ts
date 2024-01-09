import {Client, Events, ActivityType, PermissionsBitField, ChannelType} from "discord.js";
import {BotEvent} from "../types";


const group = JSON.parse(process.env.CLASSROOM_LIST || "[]") as { name: string, role_id: string, tag: string }[];
const groupB3 = group.filter(g => g.name.toUpperCase().includes("B3"));


const event: BotEvent = {
    name: Events.VoiceStateUpdate,
    once: false,
    async execute(oldState, newState) {
        if (newState.member.user.bot) return;
        //vérifier si l'utilisateur entre dans le salon vocal du .env CHANNEL_TEMP_VOCAL_ID
        if (newState.channelId === process.env.CHANNEL_TEMP_VOCAL_ID) {
            //créer un salon vocal temporaire dans la catégorie CHANNEL_TEMP_CATEGORIE_ID avec le nom de l'utilisateur
             const channel = await newState.guild.channels.create({
                type: ChannelType.GuildVoice,
                name: newState.member.user.username,
                parent: process.env.CHANNEL_TEMP_CATEGORIE_ID,
                permissionOverwrites: [
                    {
                        id: newState.guild.roles.everyone.id,
                        deny: [PermissionsBitField.All]
                    },
                    {
                        id: process.env.ROLE_INTERVENANT_ID,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak, PermissionsBitField.Flags.Stream, PermissionsBitField.Flags.UseVAD, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.PrioritySpeaker, PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.AddReactions ],
                        deny: [PermissionsBitField.Flags.MentionEveryone, PermissionsBitField.Flags.UseEmbeddedActivities, PermissionsBitField.Flags.UseSoundboard, PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ManageEvents, PermissionsBitField.Flags.ManageWebhooks, PermissionsBitField.Flags.ManageGuild, PermissionsBitField.Flags.ManageGuildExpressions, PermissionsBitField.Flags.ManageGuildExpressions, PermissionsBitField.Flags.ManageRoles, PermissionsBitField.Flags.UseExternalSounds, PermissionsBitField.Flags.SendVoiceMessages, PermissionsBitField.Flags.MoveMembers, PermissionsBitField.Flags.MuteMembers, PermissionsBitField.Flags.DeafenMembers, PermissionsBitField.Flags.CreateInstantInvite ]
                    },
                    {
                        id: groupB3[0].role_id,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak, PermissionsBitField.Flags.Stream, PermissionsBitField.Flags.UseVAD, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.AddReactions ],
                        deny: [PermissionsBitField.Flags.MentionEveryone, PermissionsBitField.Flags.UseEmbeddedActivities, PermissionsBitField.Flags.UseSoundboard, PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ManageEvents, PermissionsBitField.Flags.ManageWebhooks, PermissionsBitField.Flags.ManageGuild, PermissionsBitField.Flags.ManageGuildExpressions, PermissionsBitField.Flags.ManageGuildExpressions, PermissionsBitField.Flags.ManageRoles, PermissionsBitField.Flags.UseExternalSounds, PermissionsBitField.Flags.SendVoiceMessages, PermissionsBitField.Flags.MoveMembers, PermissionsBitField.Flags.MuteMembers, PermissionsBitField.Flags.DeafenMembers, PermissionsBitField.Flags.CreateInstantInvite, PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.PrioritySpeaker ]
                    },
                ]
            });
            await newState.setChannel(channel);

        }

        //vérifier si l'utilisateur quitte le salon vocal temporaire précédemment créé (doit être dans la catégorie CHANNEL_TEMP_CATEGORIE_ID et ne doit pas être le salon CHANNEL_TEMP_VOCAL_ID)
        if (oldState.channelId !== null && oldState.channelId !== process.env.CHANNEL_TEMP_VOCAL_ID && oldState.channel.parentId === process.env.CHANNEL_TEMP_CATEGORIE_ID) {
            if (oldState.channel.members.size === 0) {
                //supprimer le salon vocal temporaire
                oldState.channel.delete();
            } else {
                //récupérer le nom du salon vocal temporaire et vérifier si un des utilisateurs a le même nom
                const channelNames = oldState.channel.members.map(member => member.user.username);
                const channelName = oldState.channel.name;
                //si aucun utilisateur n'a le même nom, renommer le salon vocal temporaire avec le nom du groupe
                if (!channelNames.includes(channelName)) {
                    console.log("renommage du salon temporaire");
                    const member = oldState.channel.members.first();
                    await oldState.channel.setName(member.user.username, `Renommage du salon temporaire par ${member.user.username} (${member.user.globalName})`)
                }
            }
        }
    }
}

export default event;
