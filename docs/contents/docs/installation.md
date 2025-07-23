---
sidebar_position: 2
---

# Installation

Ce guide vous accompagne dans l'installation et la configuration du Bot Discord Epsius sur votre machine locale.

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants :

- **Node.js** (version 18 ou supérieure)
- **pnpm** (gestionnaire de paquets recommandé)
- **Git**
- Un compte Discord Developer Portal

## 🔧 Installation du projet

### 1. Cloner le dépôt

```bash
git clone https://github.com/Epsius-44/Bot-Discord.git
cd Bot-Discord
```

### 2. Installer les dépendances

```bash
pnpm install
```

Si vous préférez npm :

```bash
npm install
```

### 3. Configuration de l'environnement

Créez un fichier `.env` à la racine du projet :

```bash
touch .env
```

Ajoutez les variables d'environnement nécessaires (voir [Configuration](./configuration) pour plus de détails) :

```env
LZL_DISCORD_TOKEN=votre_token_discord_ici
```

## 🏗️ Compilation et lancement

### Mode développement

Pour lancer le bot en mode développement avec rechargement automatique :

```bash
pnpm start
```

Cette commande :
1. Supprime le dossier `build` existant
2. Compile le TypeScript en temps réel
3. Relance automatiquement le bot à chaque modification

### Mode production

Pour compiler et lancer le bot en mode production :

```bash
# Compilation
pnpm build

# Lancement
pnpm serve
```

## 🔍 Vérification de l'installation

Si tout est correctement configuré, vous devriez voir dans la console :

```
Logged in as VotreBotName#1234!
```

## 🛠️ Scripts disponibles

| Script | Description |
|--------|-------------|
| `pnpm start` | Lance le bot en mode développement |
| `pnpm build` | Compile le TypeScript |
| `pnpm serve` | Lance le bot compilé |
| `pnpm lint` | Vérifie la qualité du code |

## 🐛 Résolution des problèmes

### Erreur de token Discord

Si vous obtenez une erreur de connexion :
- Vérifiez que votre token Discord est correct
- Assurez-vous que le fichier `.env` est bien à la racine du projet
- Vérifiez que votre bot a les permissions nécessaires

### Erreurs de compilation TypeScript

Si vous rencontrez des erreurs TypeScript :
- Vérifiez que vous utilisez Node.js version 18+
- Supprimez `node_modules` et `build`, puis réinstallez :

```bash
rm -rf node_modules build
pnpm install
```

### Problèmes de permissions

Assurez-vous que votre bot Discord a les permissions suivantes dans votre serveur :
- Lire les messages
- Envoyer des messages
- Utiliser les commandes slash

## ➡️ Étape suivante

Une fois l'installation terminée, consultez la page [Configuration](./configuration) pour configurer votre bot Discord.
