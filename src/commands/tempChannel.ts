import {
  ApplicationCommandOptionChoiceData,
  ChannelType,
  GuildMemberRoleManager,
  InteractionContextType,
  OverwriteResolvable,
  PermissionsBitField,
  SlashCommandBuilder
} from "discord.js";
import AppCommand from "../class/AppCommand.js";

const groups = [
  {
    name: "I2 Promo",
    tag: "i2",
    roles: ["1284483940614406196"]
  },
  {
    name: "I2 SysOps",
    tag: "2s",
    roles: ["1284484894386294865"]
  },
  {
    name: "I2 Cyber",
    tag: "2c",
    roles: ["1284485001278259260"]
  },
  {
    name: "E2 Wis",
    tag: "e2",
    roles: ["1284484307142053914"]
  },
  {
    name: "I2 DevOps Groupe 1",
    tag: "2d1",
    roles: ["1284484627729219666"]
  },
  {
    name: "I2 DevOps Groupe 2",
    tag: "2d2",
    roles: ["1284484770708848676"]
  },
  {
    name: "I2 IA",
    tag: "2a",
    roles: ["1284484492412719147"]
  },
  {
    name: "I2 Dev ++ (DevOps G1 + IA + Cyber)",
    tag: "2dc",
    roles: ["1284484627729219666", "1284484492412719147", "1284485001278259260"]
  }
];

export default new AppCommand({
  data: new SlashCommandBuilder()
    .setName("add_temp_channel")
    .setDescription("Crée un salon temporaire pour un module")
    .addStringOption((option) =>
      option
        .setName("module")
        .setDescription("Nom du salon temporaire")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("groupe")
        .setDescription("Groupe en lien avec le module")
        .setRequired(true)
        .setAutocomplete(true)
    )
    .setContexts([InteractionContextType.Guild]),
  hasSubCommands: false,
  roles: [process.env.ROLE_MODERATOR_ID],
  autocomplete: async (interaction) => {
    const focusedOption = interaction.options.getFocused(true);
    if (!focusedOption) return;
    if (focusedOption.name == "groupe") {
      let options: ApplicationCommandOptionChoiceData<string | number>[] = [];
      // On récupérère les groupes disponibles pour chaque rôle de l'utilisateur
      (interaction.member?.roles as GuildMemberRoleManager).cache.filter(
        (role) =>
          groups.some((group) => {
            if (group.roles.includes(role.id)) {
              options.push({
                value: group.tag,
                name: group.name
              });
            }
          })
      );
      // On supprime les doublons
      options = options.filter(
        (option, index) => options.indexOf(option) === index
      );
      // On renvoie les options
      interaction.respond(options);
    }
  },
  async execute(interaction): Promise<void> {
    // On récupère les options
    const module = interaction.options.getString("module");
    const groupe = interaction.options.getString("groupe");
    const group = groups.find((group) => group.tag == groupe);
    // On vérifie que le groupe existe
    if (!group) {
      interaction.reply({
        content: "Le groupe spécifié n'existe pas",
        ephemeral: true
      });
      return;
    }
    // On vérifie si le nom du salon est entre 3 et 30 caractères
    if (module === null || module.length < 3 || module.length > 30) {
      interaction.reply({
        content: "Le nom du salon doit être compris entre 3 et 30 caractères",
        ephemeral: true
      });
      return;
    }

    // On génère les permissions
    const permissions: OverwriteResolvable[] = [
      {
        id: `${interaction.guild?.roles.everyone.id}`,
        deny: [PermissionsBitField.Flags.ViewChannel]
      },
      {
        id: process.env.ROLE_MODERATOR_ID,
        allow: [PermissionsBitField.Flags.MentionEveryone]
      }
    ];
    group.roles.forEach((role) => {
      permissions.push({
        id: role,
        allow: [PermissionsBitField.Flags.ViewChannel]
      });
    });
    // On crée le salon
    const channel = await interaction.guild?.channels.create({
      name: `${group.tag}-${module}`,
      type: ChannelType.GuildText,
      parent: process.env.CATEGORY_TEMP_CHANNEL,
      reason: `Création du salon temporaire ${module} via la commande /temp_channel add par ${interaction.member?.user.username} (${interaction.member?.user.id})`,
      permissionOverwrites: permissions
    });
    // On envoie un message de confirmation
    await channel?.send(
      `Ce salon a été créé <t:${Math.floor(Date.now() / 1000)}:R> par ${interaction.member} pour le module **${module}** du groupe **${group.name}**`
    );

    interaction.reply({
      content: `Salon temporaire pour ${group.name}`,
      ephemeral: true
    });
  }
});
