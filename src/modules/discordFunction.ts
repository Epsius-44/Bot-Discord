import {
    PermissionFlagsBits,
    GuildMember,
    CommandInteraction, CacheType, User
} from "discord.js";

export async function discordReply(interaction: CommandInteraction<CacheType>, message: string, ephemeral: boolean = true) {
    // répondre à l'interaction
    await interaction.reply(
        {
            content: message,
            ephemeral: ephemeral
        })
    // .then(() => {})
    // .catch(() => {});
}

export async function replyIfFalse(interaction: CommandInteraction<CacheType>, result: boolean, message: string): Promise<boolean> {
    // répondre à l'interaction si le résultat est faux
    if (!result) {
        await discordReply(interaction, message);
    }
    return result;
}
export async function getMemberFromUser(interaction: CommandInteraction<CacheType>, user: User) : Promise<GuildMember | null> {
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

export function checkPermission(interaction: CommandInteraction<CacheType>, member: GuildMember, permission: bigint, message_false: string = `Vous n'avez pas la permission de faire cela`): Promise<boolean> {
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
