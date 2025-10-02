# Project A - Soulsdle API - Projet R5.08

## Spécification du système

Soulsdle est un jeu de devinettes inspiré de Wordle, mais centré sur les boss des jeux Souls de FromSoftware (Bloodborne, Sekiro, Dark Souls, Elden Ring).

### Concept du jeu

- Un boss est sélectionné aléatoirement
- Le joueur doit deviner le bon boss en le moins de tentative possible
- Après chaque proposition, des indices sont donnés sous forme de couleurs :
  - 🟢 Vert : Propriété correcte
  - 🟡 Jaune : Propriété partiellement correcte (pour les espèces multiples)
  - 🔴 Rouge : Propriété incorrecte
  - ⬆️ Flèche haute : Valeur plus élevée que la cible
  - ⬇️ Flèche basse : Valeur plus faible que la cible

### Entités métier

#### Boss

- **nom** : Nom du boss (identifiant unique)
- **jeu** : Jeu d'origine (Bloodborne, Sekiro, etc.)
- **genre** : Homme, Femme, Inconnu
- **espece** : Liste d'espèces (Humain, Bête, Grand Ancien, etc.)
- **phases** : Nombre de phases du combat (1-3)
- **nombre** : Nombre d'entités ("1", "2", "3", ">10")
- **cutscene** : Présence d'une cinématique (Oui/Non)
- **optionnel** : Boss optionnel ou obligatoire (Oui/Non)
- **dlc** : Boss de DLC (Oui/Non)

#### Partie

- **id** : Identifiant unique de la partie
- **date** : Date de la partie (pour le mode quotidien)
- **bossSecret** : Boss à deviner
- **terminee** : État de la partie

### Relations

- Une partie contient plusieurs propositions
- Chaque proposition compare les propriétés du boss proposé avec le boss secret
- Les statistiques globales agrègent les résultats de toutes les parties

## Jeu de données

Le jeu de données initial contient 37 boss :

- 22 boss de Bloodborne (dont 5 du DLC)
- 15 boss de Sekiro

### Expansion prévue

- Dark Souls I, II, III
- Elden Ring
- Demon's Souls

## Instructions pour exécuter le serveur

### Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn

### Installation

```bash
# Cloner le projet
git clone [URL_DU_REPO]
cd soulsdle-api

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Lancer en production
npm start
```

### Variables d'environnement

```bash
PORT=3000
NODE_ENV=development
```

## Méthodologie suivie

**Approche choisie : Spécification OpenAPI d'abord**

### Justification

1. **Design First** : Définir l'API avant l'implémentation permet de :

   - Clarifier les besoins métier
   - Valider l'interface avec les utilisateurs potentiels
   - Générer automatiquement la documentation
   - Utiliser des outils de génération de code

2. **Avantages pour le projet** :

   - Structure claire des endpoints
   - Validation automatique des données
   - Documentation interactive avec Swagger UI
   - Possibilité de générer des clients dans différents langages

3. **Processus suivi** :
   - Analyse du domaine métier (boss FromSoftware)
   - Définition des entités et relations
   - Conception des endpoints REST
   - Spécification OpenAPI complète
   - Génération du squelette du serveur
   - Implémentation de la logique métier

## Architecture technique

### Stack technique

- **Runtime** : Node.js
- **Framework** : Express.js
- **Documentation** : Swagger/OpenAPI 3.0
- **Base de données** : JSON (migration prévue vers MongoDB/PostgreSQL)

## Fonctionnalités implémentées

### Core API

- [x] CRUD des boss
- [x] Filtrage par jeu, DLC, optionnel
- [x] Pagination des résultats
- [x] Gestion des parties quotidiennes
- [x] Système de propositions avec indices
- [x] Statistiques globales

### Bonus

- [ ] Liens HATEOAS
- [ ] Client web React/Vue
- [ ] Authentification utilisateur
- [ ] Classements et profils

## Endpoints principaux

- `GET /` - Informations sur l'API
- `GET /boss` - Liste des boss (avec filtres)
- `GET /boss/{nom}` - Détails d'un boss
- `GET /game` - Nouvelle partie
- `POST /game/guess` - Soumettre une proposition
- `GET /stats` - Statistiques globales

## Crédits

Sinfix - Cyrian Torrejon
