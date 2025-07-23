---
title: "ready"
---

# Événement `ready`

L'événement `ready` est déclenché lorsque le bot est entièrement connecté à Discord et prêt à recevoir et traiter des événements. C'est le premier événement système crucial qui signale que le bot est opérationnel.

## 📋 Description

Cet événement marque le moment où :
- ✅ La connexion avec Discord est établie
- ✅ Toutes les données initiales sont synchronisées
- ✅ Le bot peut commencer à traiter les interactions
- ✅ Les commandes slash sont prêtes à être utilisées

:::info Événement unique
🔄 **Cet événement ne se déclenche qu'une seule fois** lors du démarrage du bot (propriété `once: true`).
:::

## 🎯 Fonctionnalités actuelles

### Informations de connexion
- Affichage du nom et tag du bot connecté
- Confirmation de la connexion réussie
- Timestamp de connexion

### Statistiques initiales
- Nombre de serveurs connectés
- Nombre d'utilisateurs accessibles
- Nombre de commandes chargées

### Initialisation système
- Validation des permissions de base
- Vérification de l'état des handlers
- Logs de démarrage structurés

## 🔧 Implémentation actuelle

### Code source

```typescript
// src/events/ready.ts
import { Events } from "discord.js";
import Event from "../class/Event.js";

export default new Event({
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`Connecté en tant que ${client.user?.tag}!`);
  }
});
```

### Structure de la classe Event

```typescript
// src/class/Event.ts
export default class Event {
  public name: string;
  public once: boolean;
  public execute: (...args: any[]) => Promise<void>;

  constructor(options: {
    name: string;
    once?: boolean;
    execute: (...args: any[]) => Promise<void>;
  }) {
    this.name = options.name;
    this.once = options.once ?? false;
    this.execute = options.execute;
  }
}
```

## 📊 Informations loggées

### Format actuel

```bash
Connecté en tant que BotEpsius#1234!
```

### Format amélioré prévu

```bash
[2025-01-23 14:30:15] ✅ BOT READY
[2025-01-23 14:30:15] 📝 Nom: Bot Discord Epsius
[2025-01-23 14:30:15] 🆔 ID: 123456789012345678
[2025-01-23 14:30:15] 🏫 Serveurs: 1
[2025-01-23 14:30:15] 👥 Utilisateurs: 42
[2025-01-23 14:30:15] ⚡ Commandes: 3 chargées
[2025-01-23 14:30:15] 🎯 Statut: Prêt à recevoir des interactions
```

## 🚀 Améliorations prévues

### Phase 1 : Logs enrichis

```typescript
export default new Event({
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    const readyTime = new Date().toLocaleString('fr-FR');

    console.log(`\n🚀 ===== BOT DISCORD EPSIUS =====`);
    console.log(`✅ Statut: CONNECTÉ`);
    console.log(`📅 Heure: ${readyTime}`);
    console.log(`🤖 Bot: ${client.user?.tag}`);
    console.log(`🆔 ID: ${client.user?.id}`);
    console.log(`🏫 Serveurs: ${client.guilds.cache.size}`);
    console.log(`👥 Utilisateurs: ${client.users.cache.size}`);
    console.log(`⚡ Commandes: ${client.appCommands?.size || 0}`);
    console.log(`📡 Événements: ${client.eventNames().length}`);
    console.log(`🔗 Latence: ${client.ws.ping}ms`);
    console.log(`===============================\n`);

    // Définir le statut du bot
    client.user?.setActivity('EPSI WIS Nantes', {
      type: ActivityType.Watching
    });
  }
});
```

### Phase 2 : Vérifications système

```typescript
async execute(client) {
  // Logs de base...

  // Vérifications de santé
  await performHealthChecks(client);

  // Synchronisation des commandes
  await syncSlashCommands(client);

  // Initialisation des métriques
  await initializeMetrics(client);

  // Notification aux admins (si configuré)
  await notifyAdmins(client);
}

async function performHealthChecks(client: Client) {
  console.log("🔍 Vérifications système...");

  // Vérifier les permissions essentielles
  const guilds = client.guilds.cache;
  for (const [guildId, guild] of guilds) {
    const botMember = guild.members.me;
    if (!botMember?.permissions.has('SendMessages')) {
      console.warn(`⚠️ Permission manquante dans ${guild.name}: SendMessages`);
    }
  }

  // Vérifier la connectivité
  if (client.ws.ping > 1000) {
    console.warn(`⚠️ Latence élevée: ${client.ws.ping}ms`);
  }

  console.log("✅ Vérifications terminées");
}
```

### Phase 3 : Intégrations avancées

```typescript
async execute(client) {
  // Logs et vérifications...

  // Charger les données persistantes
  await loadPersistentData(client);

  // Initialiser les tâches planifiées
  await initializeScheduledTasks(client);

  // Démarrer les services de monitoring
  await startMonitoringServices(client);

  // Synchroniser avec la base de données
  await syncDatabase(client);
}
```

## 📈 Métriques et monitoring

### Données collectées

| Métrique | Description | Utilité |
|----------|-------------|---------|
| **Temps de démarrage** | Durée depuis le lancement | Performance |
| **Latence initiale** | Ping WebSocket au ready | Connectivité |
| **Guilds connectées** | Nombre de serveurs | Portée |
| **Users cachés** | Utilisateurs en cache | Données |
| **Commandes chargées** | Commandes disponibles | Fonctionnalités |

### Dashboard prévu

```markdown
🤖 **Bot Discord Epsius - Statut**

**Dernière connexion:** 23/01/2025 à 14:30:15
**Uptime actuel:** 2j 14h 32m
**Redémarrages:** 3 cette semaine

**Performance:**
• Latence: 45ms (🟢 Excellent)
• Mémoire: 87MB / 512MB (🟢 Normal)
• CPU: 2.3% (🟢 Faible)

**Connectivité:**
• Serveurs: 1/100 (🟢 Dans les limites)
• Utilisateurs: 42 (🟢 Actifs)
• Commandes: 3/50 (🟢 Disponibles)
```

## ⚠️ Gestion d'erreurs

### Problèmes courants

#### Bot ne se connecte pas
```bash
# Erreur de token
[ERROR] Event ready: Invalid token provided

# Erreur de permissions
[ERROR] Event ready: Missing bot permissions

# Erreur réseau
[ERROR] Event ready: Connection timeout
```

#### Solutions de debug

```typescript
export default new Event({
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    try {
      // Vérifications de base
      if (!client.user) {
        throw new Error("Client user not available");
      }

      if (!client.application) {
        console.warn("⚠️ Application data not available");
      }

      // Logs normaux...
      console.log(`✅ Bot ready: ${client.user.tag}`);

    } catch (error) {
      console.error("❌ Erreur dans ready event:", error);

      // Tentative de récupération
      setTimeout(() => {
        if (client.readyAt) {
          console.log("🔄 Recovery successful");
        } else {
          console.error("💥 Recovery failed - restart required");
          process.exit(1);
        }
      }, 5000);
    }
  }
});
```

## 🔄 Cycle de vie et redémarrages

### Séquence normale

1. **Lancement du processus** (`npm start`)
2. **Initialisation du client** (création instance Discord.js)
3. **Chargement des handlers** (events, commands)
4. **Connexion à Discord** (`client.login()`)
5. **Événement ready** 🎯 **← Nous sommes ici**
6. **Bot opérationnel** (traitement des interactions)

### Cas de redémarrage

```typescript
// Redémarrage automatique en cas d'erreur critique
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  // Graceful shutdown puis restart
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1); // PM2 ou similaire relance
});
```

## 🔗 Intégrations

### Avec le système de commandes

```typescript
// Vérifier que les commandes sont prêtes
async execute(client) {
  console.log(`Ready with ${client.appCommands.size} commands:`);
  client.appCommands.forEach(command => {
    console.log(`  • ${command.data.name}`);
  });
}
```

### Avec d'autres événements

```typescript
// Le ready prépare le terrain pour les autres événements
async execute(client) {
  // Ready → interactionCreate peut maintenant traiter les commandes
  // Ready → guildMemberAdd peut maintenant accueillir les nouveaux membres
  // Ready → messageCreate peut maintenant répondre aux messages
}
```

## 📚 Cas d'utilisation

### Pour les utilisateurs
- **Indicateur visuel** : Le bot apparaît en ligne
- **Disponibilité** : Les commandes deviennent utilisables
- **Statut** : Confirmation que le bot fonctionne

### Pour les administrateurs
- **Monitoring** : Surveillance des redémarrages
- **Debug** : Identifier les problèmes de connexion
- **Métriques** : Temps de démarrage et performances

### Pour les développeurs
- **Tests** : Vérifier le bon démarrage
- **Debug** : Identifier les erreurs d'initialisation
- **Développement** : Point d'entrée pour l'initialisation

## 🔧 Configuration avancée

### Variables d'environnement utilisées

```bash
# Dans .env
LZL_DISCORD_TOKEN=your_bot_token_here
LZL_DISCORD_CLIENT_ID=your_client_id_here

# Optionnelles pour ready
LZL_LOG_LEVEL=info          # Niveau de logs
LZL_HEALTH_CHECK=true       # Activer les vérifications
LZL_NOTIFY_ADMINS=false     # Notifier les admins au démarrage
```

### Personnalisation du comportement

```typescript
// Configuration via variables d'environnement
const config = {
  logLevel: process.env.LZL_LOG_LEVEL || 'info',
  healthCheck: process.env.LZL_HEALTH_CHECK === 'true',
  notifyAdmins: process.env.LZL_NOTIFY_ADMINS === 'true',
  statusMessage: process.env.LZL_STATUS_MESSAGE || 'EPSI WIS Nantes'
};

export default new Event({
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    // Utiliser la configuration...
  }
});
```

## 🔗 Liens connexes

- **[Événement interactionCreate](./interactionCreate)** : Traitement des commandes
- **[Guide des événements](../events)** : Vue d'ensemble
- **[Architecture](../development#événements)** : Système d'événements
- **[Configuration](../configuration)** : Variables d'environnement

---

:::tip Performance
L'événement ready est critique pour les performances. Évitez les opérations lourdes et privilégiez l'initialisation asynchrone des services non-critiques après le ready.
:::
