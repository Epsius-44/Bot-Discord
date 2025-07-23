---
sidebar_position: 3
---

# Configuration

Ce guide détaille la configuration du Bot Discord Epsius, de la création de l'application Discord à la configuration des variables d'environnement.

## 🔑 Création de l'application Discord

### 1. Accéder au Discord Developer Portal

Rendez-vous sur [Discord Developer Portal](https://discord.com/developers/applications) et connectez-vous avec votre compte Discord.

### 2. Créer une nouvelle application

1. Cliquez sur **"New Application"**
2. Donnez un nom à votre application (ex: "Bot Epsius Dev")
3. Cliquez sur **"Create"**

### 3. Configurer l'application

Dans l'onglet **"General Information"** :
- Ajoutez une description
- Ajoutez une icône si souhaité
- Notez l'**Application ID** (vous en aurez besoin pour `LZL_DISCORD_CLIENT_ID`)

### 4. Créer le bot

1. Allez dans l'onglet **"Bot"** dans le menu de gauche
2. Cliquez sur **"Add Bot"**
3. Confirmez en cliquant **"Yes, do it!"**

### 5. Configurer le bot

Dans la section **"Token"** :
- Cliquez sur **"Copy"** pour copier le token (gardez-le secret !
  Vous en aurez besoin pour `LZL_DISCORD_TOKEN`)
- Activez les **Privileged Gateway Intents** si nécessaire

## 🌍 Variables d'environnement

### Fichier `.env`

Créez un fichier `.env` à la racine du projet :

```env
# Token du bot Discord (OBLIGATOIRE)
LZL_DISCORD_TOKEN=votre_token_discord_ici

# ID de l'application Discord (OBLIGATOIRE)
LZL_DISCORD_CLIENT_ID=votre_client_id_ici

# Optionnel : Mode de développement
NODE_ENV=development

# Optionnel : Niveau de log
LOG_LEVEL=info
```

### Variables disponibles

| Variable | Description | Obligatoire | Valeur par défaut |
|----------|-------------|-------------|-------------------|
| `LZL_DISCORD_TOKEN` | Token d'authentification du bot | ✅ Oui | - |
| `LZL_DISCORD_CLIENT_ID` | ID de l'application Discord | ✅ Oui | - |
| `NODE_ENV` | Environnement d'exécution | ❌ Non | `development` |
| `LOG_LEVEL` | Niveau de log (error, warn, info, debug) | ❌ Non | `info` |

:::danger Variables sensibles
⚠️ **Ne jamais committer vos tokens et IDs Discord !** \
Le fichier `.env` est déjà inclus dans `.gitignore` pour éviter les accidents.
:::

## 🤖 Invitation du bot sur votre serveur

### 1. Générer l'URL d'invitation

1. Dans le Discord Developer Portal, allez dans **"OAuth2" > "URL Generator"**
2. Dans **"Scopes"**, sélectionnez :
   - `bot`
   - `applications.commands`
3. Dans **"Bot Permissions"**, sélectionnez :
   - `Send Messages`
   - `Use Slash Commands`

### 2. Inviter le bot

1. Copiez l'URL générée
2. Collez-la dans votre navigateur
3. Sélectionnez votre serveur Discord
4. Confirmez les permissions

## ⚙️ Configuration avancée

### Intents Discord

Le bot utilise actuellement ces intents :

```typescript
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});
```

### Configuration automatique des commandes

Le bot utilise un système de chargement automatique des commandes qui :

1. **Scanne le dossier `src/commands`** pour trouver les fichiers de commandes
2. **Charge dynamiquement** chaque commande avec son handler
3. **Enregistre automatiquement** les commandes auprès de l'API Discord
4. **Gère les collections** de commandes en mémoire

### Structure de configuration

Le projet utilise une architecture modulaire avec :

- **Variables d'environnement** : Gestion via `dotenv`
- **Types globaux** : Définitions dans `src/global.d.ts`
- **Handlers automatiques** : Chargement dynamique des gestionnaires
- **Collections Discord.js** : Stockage des commandes en mémoire

## 🔧 Configuration TypeScript

Le projet utilise `tsconfig.json` pour la configuration TypeScript :

```json
{
  "extends": "@tsconfig/node22/tsconfig.json",
  "compilerOptions": {
    "outDir": "./build",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "build", "docs"]
}
```

## 🎯 Vérification de la configuration

Pour vérifier que votre configuration est correcte :

1. Lancez le bot : `pnpm start`
2. Vérifiez les logs de connexion
3. Testez la commande `/ping` sur votre serveur Discord
