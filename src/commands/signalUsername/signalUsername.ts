import {
    AutoModerationActionType,
    AutoModerationRuleEventType,
    AutoModerationRuleTriggerType,
    EmbedBuilder,
    GuildMember,
    TextChannel,
    User,
    UserContextMenuCommandInteraction
} from "discord.js";
import {checkMemberHasRole, discordReply} from "../../modules/discordFunction";

export default async function signalUsername(
    interaction: UserContextMenuCommandInteraction,
    user: User
): Promise<void> {
    const memberReport = interaction.guild?.members.cache.get(user.id);
    //vérifié que l'utilisateur a le rôle de délégué / responsable
    const role_responsable = interaction.guild?.roles.cache.get(process.env.ROLE_RESPONSABLE_ID);
    const role_admin = interaction.guild?.roles.cache.get(process.env.ROLE_ADMIN_ID);
    const log_channel = interaction.guild?.channels.cache.get(process.env.CHANNEL_LOG_ID) as TextChannel;
    const member = interaction.member;
    let is_admin = false;

    if (!await checkMemberHasRole(interaction, member as GuildMember, role_responsable, `Seul les ${role_responsable} sont autorisés pour utiliser cette commande.`)) return;

    const embed = new EmbedBuilder()
        .setTitle(`Signalement d'un pseudo`)
        .setColor(0xdadd0b)

    //vérifié que la personne concernée n'est pas un bot, un webhook ou un administrateur
    if (user.bot || memberReport.roles.cache.has(role_admin?.id)) {
        is_admin = true;
    }

    embed.addFields(
        {
            name: 'Auteur du signalement',
            value: `${member}`,
            inline: false
        },
        {
            name: "Date du signalement",
            value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
            inline: false
        },
        {
            name: 'Utilisateur signalé',
            value: `${user}`,
            inline: false
        },
        {
            name: 'pseudo signalé',
            value: `${user.username}`,
            inline: false
        },
        {
            name: 'Action',
            value: is_admin ? `${role_admin} Signalement d'un pseudo appartenant à un administrateur` : `Le pseudo a été ajouté à l'automod`,
            inline: false
        }
    );
    //récupérer les listes des règles de l'automod intégré à discord (interaction.guild.autoModerationRules)
    const autoModerationRules = interaction.guild?.autoModerationRules;
    //récupérer la règle de l'automod qui correspond au pseudo
    //récupérer la règle avec le triggerType 6 et la retournée dans la constante autoModerationRule
    // @ts-ignore
    const autoModerationRule = await autoModerationRules?.fetch().then(rules => rules.find(rule => rule.triggerType === 6));
    let mp = true;

    //envoyer un mp à l'utilisateur signalé
    await user.send({content: `Votre pseudo **"${user.username}"** a été signalé par un ***délégué / responsable*** du serveur. **Vous devez changer de pseudo pour interagir sur le serveur.**\nSi vous estimez que ce signalement est abusif, vous pouvez contacter un administrateur du serveur.`})
        .catch(() => {
            mp = false;
        });


    if (!autoModerationRule) {
        await interaction.guild?.autoModerationRules.create({
            name: "Bloquer les noms d'utilisateur (règle créée par le bot)",
            eventType: AutoModerationRuleEventType.MessageSend,
            // @ts-ignore
            triggerType: 6, //affiche une erreur alors que c'est le bon triggerType
            triggerMetadata: {
                keywordFilter: [user.username],
                regexPatterns: [],
                presets: [],
                allowList: [],
                mentionTotalLimit: null,
                mentionRaidProtectionEnabled: false
            },
            actions: [
                {
                    // @ts-ignore
                    type: 4, //affiche une erreur alors que c'est le bon type
                }
            ],
            enabled: true
        });
    }
    const listPseudo = autoModerationRule.triggerMetadata.keywordFilter;
    if (listPseudo.includes(memberReport.displayName)) {
        await discordReply(interaction, `Le pseudo de ${user} est déjà dans la liste des pseudos interdits.\n**Tout abus de cette commande sera sanctionné !!!**`);
        return;
    }
//ajouter le pseudo à la liste des pseudos interdits
    listPseudo.push(memberReport.displayName);
//vérifier que la liste ne contient pas plus de 1000 pseudos (limite de l'automod intégré à discord)
    if (listPseudo.length > 1000) {
        await discordReply(interaction, `La liste des pseudo interdits est pleine. Impossible d'ajouter le pseudo de ${user}.\n**Tout abus de cette commande sera sanctionné !!!**`);
        return;
    }
    await autoModerationRule?.edit({triggerMetadata: {keywordFilter: listPseudo}});
    await discordReply(interaction, `Le pseudo de ${user} a été ajouté à la liste des pseudos interdits. ${mp ? `${user} à été prévenu du signalement de son pseudo.` : `${user} n'a pas pu être informé de ce signalement car il a bloqué les messages privés.`}\n**Tout abus de cette commande sera sanctionné !!!**`);

// envoyer le message dans le channel de log
    await log_channel?.send({embeds: [embed]});
}