---
slug: version-history
title: Les Versions Historiques
description: Liste des versions historiques du bot Epsius (avant la v3.0.0).
authors: [lducruet]
tags: []
---

# Historique des versions

Cette page répertorie les versions historiques du bot Epsius, de la version 0.0.0 à la version 2.0.0. \
Chaque version est accompagnée de sa date de publication et d'une brève description des changements majeurs.

{/* truncate */}

## Liste des versions

:::tip
<span class="badge badge--danger">VA</span> (Version Abandonnée) correspond aux versions qui n'ont jamais été mises en production.
:::

### <span class="badge badge--danger">VA</span> POC 1 - 2022

La première version du code a été écrite en Python mais a été abandonnée 2 mois avant la rentrée scolaire (mise en production) car les nouvelles fonctionnalités de l’API Discord (les boutons et les modales) n’étaient pas disponibles dans la librairie Python.

### Version 0 - 2022-2023

Une nouvelle version est alors écrite en JavaScript. Cette version sera utilisée sur le serveur de deuxième année.

#### Présentation de la version
Epsius est un bot discord développer pour le serveur discord PSN-2 EPSI-WIS Nantes (2022-2023). \
Mais attention Epsius n'est pas un bot comme les autres !
Suite à diverses expériences scientifiques, un penguin 🐧 à demi-robot 🤖 avec une conscience vient de créer son compte Discord.

Son passe-temps, rendre des services aux étudiants d'EPSI-WIS Nantes.
Parmi les services qu'il rend :
- Il attribue les classes
- Il gère des salons temporaires
- Il donne des informations sur sa latence et celle de l'API Discord
- Il met en page les informations sur les intervenants

#### Liens

- 💻 Code source : https://github.com/louis-ducruet/Epsius-Discord-Bot

### <span class="badge badge--danger">VA</span> POC 2 - 2022

Fin octobre 2022 et suite à des erreurs de type, un nouveau projet est créé pour faire une adaptation en TypeScript. Mais le manque de temps dû au support de la version en JavaScript fait que ce projet est abandonné.

#### Présentation de la version

Epsius est un bot discord développer pour le serveur Discord PSN-2 EPSI-WIS Nantes (2022-2023). \
Mais attention Epsius n'est pas un bot comme les autres !
Suite à diverses expériences scientifiques, un penguin 🐧 avec une conscience vient de créer son compte Discord.

Son passe-temps, rendre des services aux étudiants d'EPSI-WIS Nantes.

_Réécriture du code source en TypeScript pour corriger les erreurs de type et améliorer la maintenabilité du code._

:::warning
Documentation en cours de rédaction.
:::

#### Liens

- 💻 Code source : https://github.com/Epsius-44/epsius-bot-typescript

### Version 1 - 2023-2024

L’idée d’utilisé Typescript à muri et le projet est repris de zero en ayant pour objectif de remplacer la version javascript pour la rentrée. A l’usage, l’utilisation de Typescript à permit d’éviter de nombreuses erreurs de type et de simplifier la gestion des commandes. Mais sa mise en place hasardeuse a grandement complexifié son support dans le temps.

Cette version est la première à avoir une pipeline de CI/CD qui va de la compilation à la mise à jour sur le serveur de production en passant par la publication de l’image docker.

#### Présentation de la version

Bot Discord développé en TypeScript pour serveur Discord des B3 de l’EPSI WIS Nantes de la promo 2023-2024.

:::info
Cette version possédait un site web de documentation, mais il a été supprimé depuis.
:::

#### Liens

- 💻 Code source : https://github.com/Epsius-44/Bot-Discord/tree/old-main_v1

### Version 2 - 2024-2025

La version 2 est une refonte complète du code. Elle a pour objectif d’avoir des standards de code pour facilité son maintien. Elle souhaite introduire un système de haute disponibilité pour éviter les coupures de service ainsi que l’utilisation d’une base de données.

Malheureusement, le manque de temps, la version 2 sort avec très peu de fonctionnalités (HA non fonctionnelle, pas de base de données, moins de commandes que la V1).

Cette version est la première a introduire un module codé en rust pour récupérer l'emploi du temps de manière a gagner en performance.
Elle implémente également une centralisation des logs via Loki et Grafana.

#### Liens

- 💻 Code source : https://github.com/Epsius-44/Bot-Discord/tree/main_v2
