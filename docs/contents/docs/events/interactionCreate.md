---
title: "interactionCreate"
---

# Événement `interactionCreate`

L'événement `interactionCreate` est le cœur du système d'interaction du bot. Il est déclenché chaque fois qu'un utilisateur interagit avec le bot via des commandes slash, des boutons, des menus de sélection, ou d'autres composants interactifs.

## 📋 Description

Cet événement gère toutes les interactions utilisateur :
- ✅ **Commandes slash** (`/ping`, `/help`, etc.)
- ✅ **Boutons** (prévus pour `/help`)
- ✅ **Menus de sélection** (prévus)
- ✅ **Modales** (prévus)
- ✅ **Autocomplétion** (prévue)

:::info Événement récurrent
🔄 **Cet événement se déclenche à chaque interaction** utilisateur avec le bot (propriété `once: false`).
:::

## 🎯 Fonctionnalités actuelles

### Gestion des commandes slash
- Identification de la commande demandée
- Récupération depuis la collection `client.appCommands`
- Exécution avec gestion d'erreur
- Logging des interactions

### Architecture modulaire
- Séparation claire entre types d'interaction
- Extensibilité pour nouveaux types
- Gestion centralisée des erreurs

## 🔧 Implémentation actuelle

### Code source

```typescript
// src/events/interactionCreate.ts
import { Events } from "discord.js";
import Event from "../class/Event.js";

export default new Event({
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.appCommands.get(interaction.commandName);

    if (!command) {
      console.error(`Aucune commande correspondant à ${interaction.commandName} n'a été trouvée.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'Il y a eu une erreur lors de l\'exécution de cette commande!',
          ephemeral: true
        });
      } else {
        await interaction.reply({
          content: 'Il y a eu une erreur lors de l\'exécution de cette commande!',
          ephemeral: true
        });
      }
    }
  }
});
```

## 📊 Types d'interactions gérées

### ✅ Commandes slash (`isChatInputCommand`)

```typescript
if (interaction.isChatInputCommand()) {
  const command = interaction.client.appCommands.get(interaction.commandName);
  if (command) {
    await command.execute(interaction);
  }
}
```

**Exemples :**
- `/ping` → Teste la connectivité
- `/help` → Affiche l'aide (en développement)
- `/info` → Informations sur le bot (planifiée)

### 🚧 Boutons (`isButton`) - Prévu

```typescript
// Implementation future
if (interaction.isButton()) {
  const [action, ...params] = interaction.customId.split('_');

  switch (action) {
    case 'help':
      await handleHelpButton(interaction, params);
      break;
    case 'navigation':
      await handleNavigationButton(interaction, params);
      break;
    default:
      await interaction.reply({
        content: '❌ Bouton non reconnu.',
        ephemeral: true
      });
  }
}
```

### 🚧 Menus de sélection (`isSelectMenu`) - Prévu

```typescript
// Implementation future
if (interaction.isAnySelectMenu()) {
  const [category, action] = interaction.customId.split('_');

  switch (category) {
    case 'help':
      await handleHelpSelect(interaction, action);
      break;
    case 'config':
      await handleConfigSelect(interaction, action);
      break;
  }
}
```

### 🚧 Modales (`isModalSubmit`) - Prévu

```typescript
// Implementation future
if (interaction.isModalSubmit()) {
  const modalType = interaction.customId;

  switch (modalType) {
    case 'feedback_modal':
      await handleFeedbackModal(interaction);
      break;
    case 'config_modal':
      await handleConfigModal(interaction);
      break;
  }
}
```

## 🚀 Version améliorée prévue

### Architecture complète

```typescript
// src/events/interactionCreate.ts (version future)
import { Events, InteractionType } from "discord.js";
import Event from "../class/Event.js";

export default new Event({
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction) {
    try {
      // Logging de base
      const logInfo = {
        user: interaction.user.tag,
        guild: interaction.guild?.name || 'DM',
        channel: interaction.channel?.id,
        type: InteractionType[interaction.type],
        timestamp: new Date().toISOString()
      };

      // Router vers le bon handler
      switch (interaction.type) {
        case InteractionType.ApplicationCommand:
          await handleApplicationCommand(interaction, logInfo);
          break;

        case InteractionType.MessageComponent:
          await handleMessageComponent(interaction, logInfo);
          break;

        case InteractionType.ApplicationCommandAutocomplete:
          await handleAutocomplete(interaction, logInfo);
          break;

        case InteractionType.ModalSubmit:
          await handleModalSubmit(interaction, logInfo);
          break;

        default:
          console.warn(`Type d'interaction non géré: ${interaction.type}`);
      }

    } catch (error) {
      console.error('Erreur dans interactionCreate:', error);
      await handleInteractionError(interaction, error);
    }
  }
});

// Handlers spécialisés
async function handleApplicationCommand(interaction, logInfo) {
  if (!interaction.isChatInputCommand()) return;

  console.log(`[CMD] ${logInfo.user} → /${interaction.commandName} dans ${logInfo.guild}`);

  const command = interaction.client.appCommands.get(interaction.commandName);

  if (!command) {
    console.error(`❌ Commande inconnue: ${interaction.commandName}`);
    await interaction.reply({
      content: `❌ La commande \`/${interaction.commandName}\` n'existe pas.`,
      ephemeral: true
    });
    return;
  }

  // Vérifications de permissions (si nécessaire)
  if (command.permissions && !interaction.memberPermissions?.has(command.permissions)) {
    await interaction.reply({
      content: '❌ Vous n\'avez pas les permissions nécessaires pour cette commande.',
      ephemeral: true
    });
    return;
  }

  // Vérifications de contexte
  if (command.guildOnly && !interaction.guild) {
    await interaction.reply({
      content: '❌ Cette commande ne peut être utilisée que dans un serveur.',
      ephemeral: true
    });
    return;
  }

  // Cooldown (si implémenté)
  if (command.cooldown && isCooldownActive(interaction.user.id, interaction.commandName)) {
    const remaining = getCooldownRemaining(interaction.user.id, interaction.commandName);
    await interaction.reply({
      content: `⏰ Veuillez attendre ${remaining}s avant de réutiliser cette commande.`,
      ephemeral: true
    });
    return;
  }

  // Exécution de la commande
  const startTime = Date.now();
  await command.execute(interaction);
  const duration = Date.now() - startTime;

  console.log(`[CMD] ✅ /${interaction.commandName} exécutée en ${duration}ms`);

  // Métriques (si implémentées)
  recordCommandUsage(interaction.commandName, duration, true);
}

async function handleMessageComponent(interaction, logInfo) {
  if (interaction.isButton()) {
    console.log(`[BTN] ${logInfo.user} → ${interaction.customId} dans ${logInfo.guild}`);
    await handleButtonInteraction(interaction);
  } else if (interaction.isAnySelectMenu()) {
    console.log(`[SELECT] ${logInfo.user} → ${interaction.customId} dans ${logInfo.guild}`);
    await handleSelectMenuInteraction(interaction);
  }
}

async function handleAutocomplete(interaction, logInfo) {
  console.log(`[AUTOCOMPLETE] ${logInfo.user} → ${interaction.commandName}.${interaction.options.getFocused(true).name}`);

  const command = interaction.client.appCommands.get(interaction.commandName);
  if (command && command.autocomplete) {
    await command.autocomplete(interaction);
  }
}

async function handleModalSubmit(interaction, logInfo) {
  console.log(`[MODAL] ${logInfo.user} → ${interaction.customId} dans ${logInfo.guild}`);
  await handleModalInteraction(interaction);
}

async function handleInteractionError(interaction, error) {
  console.error('Erreur d\'interaction:', {
    error: error.message,
    stack: error.stack,
    user: interaction.user.tag,
    command: interaction.isChatInputCommand() ? interaction.commandName : 'Non applicable',
    guild: interaction.guild?.name || 'DM'
  });

  const errorMessage = {
    content: '❌ Une erreur inattendue s\'est produite lors du traitement de votre interaction.',
    ephemeral: true
  };

  try {
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  } catch (followUpError) {
    console.error('Impossible de répondre à l\'interaction:', followUpError);
  }
}
```

## 📈 Métriques et analytics

### Données collectées

| Métrique | Description | Utilité |
|----------|-------------|---------|
| **Commandes/heure** | Fréquence d'utilisation | Popularité |
| **Temps d'exécution** | Performance des commandes | Optimisation |
| **Taux d'erreur** | Fiabilité du système | Debug |
| **Utilisateurs actifs** | Engagement | Analytics |
| **Commandes populaires** | Top utilisations | Roadmap |

### Logs détaillés

```bash
# Commande réussie
[2025-01-23 14:35:22] [CMD] user123#1234 → /ping dans EPSI WIS Nantes
[2025-01-23 14:35:22] [CMD] ✅ /ping exécutée en 45ms

# Erreur de commande
[2025-01-23 14:37:15] [CMD] user456#5678 → /inexistante dans EPSI WIS Nantes
[2025-01-23 14:37:15] [ERROR] ❌ Commande inconnue: /inexistante

# Interaction bouton
[2025-01-23 14:40:10] [BTN] user789#9012 → help_commands dans EPSI WIS Nantes
[2025-01-23 14:40:10] [BTN] ✅ Navigation vers page commandes

# Erreur système
[2025-01-23 14:42:33] [ERROR] Erreur d'interaction: {
  "error": "Missing permissions",
  "user": "user999#3456",
  "command": "admin",
  "guild": "EPSI WIS Nantes"
}
```

## ⚠️ Gestion d'erreurs avancée

### Types d'erreurs courants

#### 1. Commande inexistante
```typescript
if (!command) {
  await interaction.reply({
    content: `❌ La commande \`/${interaction.commandName}\` n'existe pas.\n💡 Utilisez \`/help\` pour voir les commandes disponibles.`,
    ephemeral: true
  });
  return;
}
```

#### 2. Permissions insuffisantes
```typescript
if (!interaction.memberPermissions?.has(requiredPermissions)) {
  await interaction.reply({
    content: '❌ Vous n\'avez pas les permissions nécessaires.\n🔒 Permissions requises: `ADMINISTRATOR`',
    ephemeral: true
  });
  return;
}
```

#### 3. Erreur d'exécution
```typescript
try {
  await command.execute(interaction);
} catch (error) {
  console.error(`Erreur dans /${interaction.commandName}:`, error);

  const errorEmbed = new EmbedBuilder()
    .setColor(0xFF0000)
    .setTitle('❌ Erreur d\'exécution')
    .setDescription('Une erreur s\'est produite lors de l\'exécution de la commande.')
    .addFields({
      name: 'Commande',
      value: `\`/${interaction.commandName}\``,
      inline: true
    }, {
      name: 'Code d\'erreur',
      value: `\`${error.name}\``,
      inline: true
    })
    .setTimestamp();

  await interaction.reply({
    embeds: [errorEmbed],
    ephemeral: true
  });
}
```

#### 4. Timeout d'interaction
```typescript
// Prévenir les timeouts avec defer si traitement long
if (isLongRunningCommand(interaction.commandName)) {
  await interaction.deferReply({ ephemeral: true });

  try {
    const result = await command.execute(interaction);
    await interaction.editReply(result);
  } catch (error) {
    await interaction.editReply({
      content: '❌ La commande a pris trop de temps à s\'exécuter.'
    });
  }
}
```

## 🔧 Système de cooldown prévu

### Implémentation

```typescript
// Système de cooldown en mémoire (version simple)
const cooldowns = new Map();

function isCooldownActive(userId: string, commandName: string): boolean {
  const key = `${userId}-${commandName}`;
  const cooldownData = cooldowns.get(key);

  if (!cooldownData) return false;

  const now = Date.now();
  const cooldownDuration = 5000; // 5 secondes par défaut

  return (now - cooldownData.lastUsed) < cooldownDuration;
}

function getCooldownRemaining(userId: string, commandName: string): number {
  const key = `${userId}-${commandName}`;
  const cooldownData = cooldowns.get(key);
  const cooldownDuration = 5000;

  return Math.ceil((cooldownDuration - (Date.now() - cooldownData.lastUsed)) / 1000);
}

function setCooldown(userId: string, commandName: string) {
  const key = `${userId}-${commandName}`;
  cooldowns.set(key, { lastUsed: Date.now() });

  // Cleanup automatique après expiration
  setTimeout(() => {
    cooldowns.delete(key);
  }, 5000);
}
```

## 🔗 Intégrations système

### Avec les commandes
```typescript
// Les commandes utilisent l'interaction pour répondre
export default new AppCommand({
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Teste la connectivité"),
  async execute(interaction) {
    // L'interaction vient d'interactionCreate
    await interaction.reply("Pong!");
  }
});
```

### Avec les événements
```typescript
// interactionCreate peut déclencher d'autres événements personnalisés
async function handleApplicationCommand(interaction, logInfo) {
  // ... traitement ...

  // Émettre un événement personnalisé
  interaction.client.emit('commandUsed', {
    command: interaction.commandName,
    user: interaction.user,
    guild: interaction.guild,
    success: true
  });
}
```

## 📚 Cas d'utilisation avancés

### Navigation interactive avec boutons
```typescript
// Exemple pour /help avec navigation
const helpEmbed = new EmbedBuilder()
  .setTitle("📚 Aide du Bot")
  .setDescription("Utilisez les boutons pour naviguer");

const navigationRow = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setCustomId('help_commands')
      .setLabel('📋 Commandes')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('help_events')
      .setLabel('📡 Événements')
      .setStyle(ButtonStyle.Secondary)
  );

await interaction.reply({
  embeds: [helpEmbed],
  components: [navigationRow],
  ephemeral: true
});
```

### Autocomplétion intelligente
```typescript
// Exemple pour une commande avec autocomplétion
export default new AppCommand({
  data: new SlashCommandBuilder()
    .setName("search")
    .setDescription("Rechercher dans la documentation")
    .addStringOption(option =>
      option.setName("query")
        .setDescription("Terme à rechercher")
        .setAutocomplete(true)
        .setRequired(true)
    ),
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    const suggestions = searchDocumentation(focusedValue);

    await interaction.respond(
      suggestions.slice(0, 25).map(choice => ({
        name: choice.title,
        value: choice.slug
      }))
    );
  },
  async execute(interaction) {
    // Traiter la recherche...
  }
});
```

## 🔗 Liens connexes

- **[Événement ready](./ready)** : Démarrage du bot
- **[Guide des événements](../events)** : Vue d'ensemble
- **[Commandes](../commands)** : Système de commandes
- **[Architecture](../development#interactions)** : Système d'interactions

---

:::tip Performance
Pour les commandes nécessitant un traitement long (>3 secondes), utilisez `interaction.deferReply()` pour éviter les timeouts Discord.
:::
