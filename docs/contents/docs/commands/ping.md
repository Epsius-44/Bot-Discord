---
title: "ping"
description: "La commande /ping teste la connectivité et le bon fonctionnement du bot Discord Epsius."
---

# Commande `/ping`

La commande `/ping` est une commande de test essentielle qui permet de vérifier la connectivité et le bon fonctionnement du bot.

## 📋 Description

Teste la connectivité du bot Discord et confirme que le système de commandes fonctionne correctement. Cette commande est particulièrement utile pour :

- Vérifier que le bot est en ligne et réactif
- Vérifier l'enregistrement des commandes
- Vérifier la gestion des interactions

## 🎯 Utilisation

### Syntaxe
```
/ping
```

### Paramètres
Cette commande ne prend aucun paramètre.

## 📤 Réponse

La commande répond immédiatement avec :

```
Pong !
```

### Caractéristiques de la réponse
- **Type** : Message éphémère (visible seulement par l'utilisateur)
- **Délai** : Réponse instantanée
- **Visibilité** : Privée (utilise `MessageFlags.Ephemeral`)

## 🔧 Détails techniques

### Propriétés

| Propriété | Valeur | Description |
|-----------|--------|-------------|
| **Nom** | `ping` | Nom de la commande |
| **Type** | Slash Command | Commande slash native Discord |
| **Cooldown** | Aucun | Peut être utilisée sans limitation |
| **Sous-commandes** | Non | Commande simple sans variations |
| **Autocomplétion** | Non | Pas de paramètres à compléter |

### 🌐 Contextes supportés

La commande `/ping` fonctionne dans tous les contextes Discord :

#### ✅ Serveurs Discord (`Guild`)
- Utilisable dans tous les salons textuels
- Visible seulement par l'utilisateur qui l'exécute
- Aucune permission serveur requise

#### ✅ Messages privés (`BotDM`)
- Fonctionne en conversation privée avec le bot
- Idéal pour tester la connectivité en privé

#### ✅ Canaux privés (`PrivateChannel`)
- Compatible avec les threads et canaux privés
- Maintient la confidentialité de la réponse

### 🔐 Permissions

#### Permissions bot
Le bot doit avoir les permissions suivantes :
- ✅ **Utiliser les commandes slash** (`USE_SLASH_COMMANDS`)
- ✅ **Envoyer des messages** (`SEND_MESSAGES`)
