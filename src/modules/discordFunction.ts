import {
    PermissionFlagsBits,
    GuildMember,
    CommandInteraction, CacheType, User, Role, TextChannel, EmbedBuilder
} from "discord.js";

export async function discordReply(interaction: CommandInteraction<CacheType>| ButtonInteraction<CacheType>, message: string, ephemeral: boolean = true) {
    // répondre à l'interaction
    await interaction.reply(
        {
            content: message,
            ephemeral: ephemeral
        })
    // .then(() => {})
    // .catch(() => {});
}

export async function replyIfFalse(interaction: CommandInteraction<CacheType>| ButtonInteraction<CacheType>, result: boolean, message: string): Promise<boolean> {
    // répondre à l'interaction si le résultat est faux
    if (!result) {
        await discordReply(interaction, message);
    }
    return result;
}

export async function getMemberFromUser(interaction: CommandInteraction<CacheType>, user: User): Promise<GuildMember | null> {
    // récupérer le membre depuis l'utilisateur
    return await interaction.guild?.members.fetch(user).then(
        member => {
            return member as GuildMember;
        }
    ).catch(
        () => {
            return null;
        }
    );
}

export function getCommandMemberAsGuildMember(interaction: CommandInteraction<CacheType>): GuildMember {
    // récupérer le membre depuis l'utilisateur
    return interaction.member as GuildMember;
}

export function memberExist(member: GuildMember | null): boolean {
    // vérifié que l'utilisateur ciblé est sur le serveur
    return member !== null;
}

export async function checkMemberOnServer(interaction: CommandInteraction<CacheType>, member: GuildMember | null, message_false: string = `L'utilisateur n'est pas sur le serveur`): Promise<boolean> {
    // vérifié que l'utilisateur ciblé est sur le serveur et répondre à l'interaction si ce n'est pas le cas
    return await replyIfFalse(interaction, memberExist(member), message_false);
}

export function hasPermission(member: GuildMember, permission: bigint) {
    return member.permissions.has(permission);
}

export function checkPermission(interaction: CommandInteraction<CacheType> | ButtonInteraction<CacheType>, member: GuildMember, permission: bigint, message_false: string = `Vous n'avez pas la permission de faire cela`): Promise<boolean> {
    // vérifié que l'utilisateur a la permission demandée et répondre à l'interaction si ce n'est pas le cas
    return replyIfFalse(interaction, hasPermission(member, permission), message_false);
}

export async function checkMemberKickable(interaction: CommandInteraction<CacheType>, member: GuildMember, message_false: string = `Cet utilisateur ne peut pas être muté`): Promise<boolean> {
    // vérifié que l'utilisateur peut être mute et répondre à l'interaction si ce n'est pas le cas
    return await replyIfFalse(interaction, member.kickable, message_false);
}

export async function checkMemberIsTimeout(interaction: CommandInteraction<CacheType>, member: GuildMember, message_false: string = `Cet utilisateur n'est pas mute`): Promise<boolean> {
    // vérifié que l'utilisateur est mute et répondre à l'interaction si ce n'est pas le cas
    return await replyIfFalse(interaction, member.communicationDisabledUntil !== null, message_false);
}

export async function checkRoleExist(interaction: CommandInteraction<CacheType>, role: Role, message_false: string = "Le rôle n'existe pas"): Promise<boolean> {
    // vérifié que le rôle existe et répondre à l'interaction si ce n'est pas le cas
    return await replyIfFalse(interaction, role !== undefined, message_false);
}

export async function checkMemberHasRole(interaction: CommandInteraction<CacheType>, member: GuildMember, role: Role, message_false: string = "L'utilisateur n'a pas le rôle", inversed: boolean = false): Promise<boolean> {
    // vérifié que l'utilisateur a le rôle et répondre à l'interaction si ce n'est pas le cas (inversed = true pour vérifier que l'utilisateur n'a pas le rôle)
    if (inversed) {
        return await replyIfFalse(interaction, !member.roles.cache.has(role.id), message_false);
    } else {
        return await replyIfFalse(interaction, member.roles.cache.has(role.id), message_false);
    }
}

export async function sendDM(user: GuildMember | User, message: string): Promise<boolean> {
    // envoyer un message privé à l'utilisateur
    return await user.send(message).then(
        () => {
            return true;
        }
    ).catch(
        () => {
            return false;
        }
    );
}

export async function checkLength(interaction: CommandInteraction<CacheType>, value: number, minValue:number = 0, maxValue:number, message_false: string = `La valeur doit être comprise entre ${minValue} et ${maxValue}`): Promise<boolean> {
    return await replyIfFalse(interaction, value >= minValue && value <= maxValue, message_false);
}

export async function sendLogEmbed(
    channel: TextChannel, administrator: GuildMember | User, accused: GuildMember | User, reason: string, action: string | null = null, isSentence: boolean = false, timestampEnd: number | null = null) {
    // créer un embed pour les logs
    console.log("raison: " + reason);
    console.log("timestampEnd: " + timestampEnd);
    console.log("isSentence: " + isSentence);
    const timestampStart = Date.now();
    const embed = new EmbedBuilder()
        .setColor(isSentence ? 15879747 : 35406)
        .setTitle(`Modération`)
        .addFields({name: `Modérateur`, value: `${administrator}`, inline: false}, {
                name: `Accusé`,
                value: `${accused}`,
                inline: false
            },
            // {name: `Raison`, value: reason !== null ? `${reason}`: '', inline: false},
            {name: `Action`, value: `${action}`, inline: false});
    if (reason !== null && reason !== '') {
        embed.addFields({name: `Raison`, value: `${reason}`, inline: false});
    }
    embed.addFields({
        name: isSentence ? 'Date de début' : 'Date',
        value: `<t:${Math.floor(timestampStart / 1000)}:F>`,
        inline: true
    });
    if (timestampEnd !== null) {
        embed.addFields({
            name: isSentence ? 'Date de fin' : '',
            value: `<t:${Math.floor(timestampEnd)}:F>`,
            inline: true
        }, {
            name: isSentence ? 'Fin: ' : '',
            value: `<t:${Math.floor(timestampEnd)}:R>`,
            inline: false
        });
    }
    await channel.send({embeds: [embed]});
}
