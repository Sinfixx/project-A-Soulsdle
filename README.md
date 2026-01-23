# Project A - Soulsdle

Vidéo de Démo : https://youtu.be/Usghnl9aYso

Lien GitHub : https://github.com/Sinfixx/project-A-Soulsdle

## Spécification du système

Soulsdle est un jeu de devinettes inspiré de Wordle, centré sur les boss des jeux Souls de FromSoftware (Bloodborne, Sekiro, Dark Souls, Elden Ring...).

Pour plus d'infos : https://fr.wikipedia.org/wiki/Souls

### Concept du jeu

- Un boss est sélectionné aléatoirement chaque jour
- Le joueur doit deviner le bon boss en le moins de tentatives possible
- Après chaque proposition, des indices sont donnés sous forme de couleurs :
  - Vert : Propriété correcte
  - Jaune : Propriété partiellement correcte (pour les espèces multiples)
  - Rouge : Propriété incorrecte

### Entités métier

#### Boss

- **nom** : Nom du boss (identifiant unique)
- **jeu** : Jeu d'origine (Bloodborne, Sekiro, Dark Souls, Dark Souls III, Elden Ring, Demon's Souls, Dark Souls II)
- **genre** : Homme, Femme, Inconnu
- **espece** : Liste d'espèces (Humain, Bête, Grand Ancien, etc.)
- **phases** : Nombre de phases du combat (de 1 à 3)
- **nombre** : Nombre d'entités ("1", "2", "3", ">10")
- **cutscene** : Présence d'une cinématique (Oui/Non)
- **optionnel** : Boss optionnel ou obligatoire (Obligatoire/Optionnel)
- **dlc** : Boss de DLC (DLC/Base)

#### Joueur

- **pseudo** : Pseudonyme unique
- **email** : Adresse email unique
- **password** : Mot de passe chiffré (bcrypt)
- **partiesGagnees** : Nombre de victoires
- **streakActuelle** : Nombre de jours consécutifs avec une victoire
- **meilleureStreak** : Record personnel de streak
- **dateInscription** : Date de création du compte

#### Partie

- **id** : Identifiant unique de la partie
- **dateDebut** : Date de début de la partie
- **dateFin** : Date de fin de la partie
- **bossSecret** : Boss à deviner
- **tentatives** : Nombre de tentatives effectuées
- **joueurId** : Référence au joueur

#### Achievement

- **id** : Identifiant unique
- **nom** : Nom du trophée
- **description** : Description de l'objectif
- **icone** : Emoji représentant le trophée
- **categorie** : Progression, Compétence, Collection, Spécial
- **rarete** : Commun, Rare, Épique, Légendaire
- **condition** : Critères de déblocage (type, valeur, jeu, tentatives max)
- **ordre** : Ordre d'affichage

#### JoueurAchievement

- **joueurId** : Référence au joueur
- **achievementId** : Référence au trophée
- **dateDeblocage** : Date de déblocage (si débloqué)
- **progression** : Pourcentage de progression (0-1)
- **progressionActuelle** : Valeur actuelle
- **progressionRequise** : Valeur cible

## Jeu de données

Le système utilise **MongoDB** avec les collections suivantes :

### 1. Boss (`boss`)

Collection des boss à deviner avec leurs caractéristiques :

- **88 boss** au total répartis sur 7 jeux FromSoftware
- Propriétés : nom, jeu, genre, espèce, phases, nombre, cutscene, optionnel, dlc

### 2. Souls (`souls`)

Informations sur les jeux FromSoftware supportés :

- Bloodborne (2015)
- Sekiro (2019)
- Dark Souls III (2016)
- Dark Souls (2011)

Non supportés :

- Elden Ring (2022)
- Demon's Souls (2009)
- Dark Souls II (2014)

### 3. Joueurs (`joueurs`)

Profils des joueurs inscrits avec authentification :

- Authentification JWT
- Statistiques personnelles (victoires, streaks)
- Historique des parties

### 4. Parties (`parties`)

Historique complet des parties jouées :

- ID unique, dates de début/fin
- Boss secret, nombre de tentatives
- Joueur associé
- Tri chronologique (parties les plus récentes d'abord)

### 5. Achievements (`achievements`)

Système de trophées avec 10 achievements :

- Premier sang (Commun) - Première victoire
- Hot streak (Rare) - Streak de 10 jours
- Roi des Souls (Légendaire) - Streak de 50 jours
- Sniper (Rare) - 3 victoires en ≤3 tentatives
- Chanceux (Épique) - Victoire en 1 tentative
- Persévérant (Rare) - 100 parties jouées
- Hunter (Épique) - 50 victoires sur Bloodborne
- Chosen Undead (Épique) - 50 victoires sur Dark Souls
- Ashen One (Épique) - 50 victoires sur Dark Souls III
- Shinobi (Épique) - 50 victoires sur Sekiro

### 6. JoueurAchievement (`joueur_achievements`)

Table de jonction pour le suivi des achievements :

- Progression en temps réel
- Date de déblocage
- Statistiques personnelles

## Architecture technique

### Backend

- **Runtime** : Node.js 18+
- **Framework** : Express.js
- **Base de données** : MongoDB avec Mongoose ODM
- **Authentification** : JWT (JSON Web Tokens)
- **Sécurité** : bcrypt pour les mots de passe
- **Documentation** : OpenAPI 3.0 avec Swagger UI
- **Variables d'environnement** : dotenv

### Frontend

- **Framework** : Angular 18+ (Standalone Components)
- **Langage** : TypeScript
- **État** : Signals et BehaviorSubject (RxJS)
- **HTTP** : HttpClient avec intercepteurs
- **Routing** : Angular Router avec guards
- **Styles** : CSS modulaire avec thèmes par jeu

## Instructions pour exécuter le projet

### Prérequis

- Node.js version 18 ou supérieure
- MongoDB en cours d'exécution (local ou distant)
- npm ou yarn

### Installation

```bash
# Docker (le fichier docker-compose.yml est dans la racine du projet)

docker compose up -d

# Backend - Installation et configuration
cd backend
npm install
# Créer un fichier .env avec :
# MONGODB_URI=mongodb:http://localhost:8081/db/soulsdle/
# JWT_SECRET=votre_secret_jwt
# PORT=3000

# Initialiser la base de données
node seed.js

# Lancer le serveur backend
node server.js
# ou
npm start

# Backend disponible sur http://localhost:3000
# Documentation API sur http://localhost:3000/api-docs

# Frontend - Installation et lancement
cd ../frontend/project-A-soulsdle
npm install
npm start
# Frontend disponible sur http://localhost:4200
```

### Variables d'environnement

Backend (`.env`) :

```bash
MONGODB_URI=mongodb://localhost:27017/soulsdle
JWT_SECRET=votre_secret_jwt_secure
PORT=3000
NODE_ENV=development
```

## Méthodologie suivie

**Approche : API First avec spécification OpenAPI**

### Justification

1. **Design First** : Définir l'API avant l'implémentation permet de :
   - Clarifier les besoins métier
   - Valider l'interface avant développement
   - Générer automatiquement la documentation
   - Faciliter le développement frontend/backend en parallèle

2. **Avantages pour le projet** :
   - Structure claire des endpoints
   - Validation automatique des données
   - Documentation interactive avec Swagger UI
   - Contrat d'interface partagé entre équipes

3. **Processus suivi** :
   - Analyse du domaine métier (boss FromSoftware)
   - Définition des entités et relations
   - Conception des endpoints REST
   - Spécification OpenAPI complète
   - Implémentation backend (Node.js + MongoDB)
   - Développement frontend (Angular)

## Fonctionnalités implémentées

### Backend API

- Authentification JWT complète (inscription, connexion, vérification)
- CRUD sur toutes les entités (Boss, Souls, Joueurs, Parties)
- Système de jeu avec génération de boss aléatoire et vérification des propositions
- Gestion des streaks automatique (calcul jour par jour)
- Système d'achievements avec progression en temps réel
- Filtrage et tri des parties (paramètre sort)
- Validation des données avec Mongoose schemas
- Gestion d'erreurs centralisée
- Documentation Swagger complète

### Frontend Angular

- Authentification complète avec garde de routes
- Page de jeu avec système de propositions et indices colorés
- Profil joueur avec statistiques et historique des 5 dernières parties
- Page Souls avec informations détaillées sur chaque jeu
- Page Boss avec liste complète et formulaire d'ajout/modification
- Page Achievements avec filtres par catégorie et rareté
- Système de thèmes CSS par jeu (7 thèmes différents)
- Intercepteur HTTP pour injection automatique du token JWT
- Gestion d'état avec Signals et BehaviorSubject
- Design responsive et thème sombre élégant

### Système d'Achievements

- 10 achievements répartis sur 4 raretés (Commun, Rare, Épique, Légendaire)
- Vérification automatique après chaque victoire
- Progression en temps réel avec barres de progression
- Interface de visualisation avec filtres et animations
- Effets visuels spéciaux pour les achievements légendaires (bordure aurore boréale animée)

## Endpoints principaux

### Authentification

- `POST /auth/register` - Inscription
- `POST /auth/login` - Connexion (retourne JWT)
- `GET /auth/me` - Profil utilisateur connecté
- `POST /auth/verify` - Vérification du token

### Boss

- `GET /boss` - Liste des boss avec filtres
- `GET /boss/:nom` - Détails d'un boss
- `POST /boss` - Ajouter un boss (protégé)
- `PUT /boss/:nom` - Modifier un boss (protégé)
- `DELETE /boss/:nom` - Supprimer un boss (protégé)

### Souls

- `GET /souls` - Liste des jeux Souls
- `GET /souls/:id` - Détails d'un jeu
- `POST /souls` - Ajouter un jeu (protégé)
- `PUT /souls/:id` - Modifier un jeu (protégé)
- `DELETE /souls/:id` - Supprimer un jeu (protégé)

### Joueurs

- `GET /joueurs` - Liste des joueurs
- `GET /joueurs/:id` - Profil d'un joueur
- `PUT /joueurs/:id` - Modifier un joueur (protégé)
- `DELETE /joueurs/:id` - Supprimer un joueur (protégé)

### Parties

- `GET /parties` - Historique des parties (avec tri et filtres)
- `GET /parties/:id` - Détails d'une partie
- `POST /parties` - Créer une partie (protégé)
- `DELETE /parties/:id` - Supprimer une partie (protégé)

### Jeu

- `GET /jeu` - Démarrer une nouvelle session de jeu (protégé)
- `POST /jeu/guess` - Soumettre une proposition (protégé)

### Achievements

- `GET /achievements` - Liste tous les achievements avec statistiques globales
- `GET /achievements/me` - Achievements du joueur connecté (protégé)
- `GET /achievements/:id` - Détails d'un achievement spécifique
- `POST /achievements/check-all` - Vérifier tous les achievements du joueur (protégé)

## Système de Streaks

Le système de streaks encourage la régularité :

- **streakActuelle** : Nombre de jours consécutifs avec au moins une victoire
- **meilleureStreak** : Record personnel du joueur
- Calcul automatique basé sur les dates de parties gagnées
- Réinitialisation si un jour est manqué
- Mise à jour automatique après chaque victoire

### Logique de calcul

- La streak augmente de 1 si victoire le jour suivant
- Réinitialisée à 1 si plus d'un jour s'est écoulé
- Plusieurs victoires le même jour ne comptent qu'une fois
- Mise à jour de la meilleure streak si dépassée

## Design et UX

- Design minimaliste noir et blanc
- Animations fluides et subtiles
- Effets hover sur toutes les cartes
- Bordures animées pour les éléments légendaires
- Interface responsive adaptée mobile/desktop

## Structure du projet

```
projet/
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   └── jwt.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Boss.js
│   │   ├── Joueur.js
│   │   ├── Partie.js
│   │   ├── Souls.js
│   │   ├── Achievement.js
│   │   └── JoueurAchievement.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── boss.js
│   │   ├── jeu.js
│   │   ├── joueurs.js
│   │   ├── parties.js
│   │   ├── souls.js
│   │   └── achievements.js
│   ├── services/
│   │   └── achievementService.js
│   ├── server.js
│   ├── seed.js
│   └── package.json
├── frontend/
│   └── project-A-soulsdle/
│       └── src/
│           └── app/
│               ├── features/
│               │   ├── auth/
│               │   │   ├── login/
│               │   │   └── register/
│               │   ├── boss/
│               │   │   ├── boss-card/
│               │   │   ├── boss-form/
│               │   │   └── boss-list/
│               │   ├── game/
│               │   └── stats/
│               │       ├── achievement/
│               │       ├── player/
│               │       └── stats/
│               ├── guards/
│               │   └── auth.guard.ts
│               ├── models/
│               │   └── boss.model.ts
│               └── services/
│                   ├── api.ts
│                   ├── auth.ts
│                   ├── auth.interceptor.ts
│                   ├── boss.ts
│                   ├── game-state.ts
│                   ├── player.ts
│                   ├── stats.ts
│                   └── achievement.ts
├── soulsdle-api-spec.yaml
├── soulsdle.json
└── README.md
```

## Documentation API

La documentation complète de l'API est disponible via Swagger UI :

- URL : http://localhost:3000/api-docs
- Format : OpenAPI 3.0
- Fichier source : `soulsdle-api-spec.yaml`

La documentation inclut :

- Tous les endpoints avec paramètres et réponses
- Schémas de données complets
- Exemples de requêtes/réponses
- Codes d'erreur possibles
- Schéma d'authentification Bearer JWT

## Tests et validation

- Validation des schémas Mongoose côté backend
- Gestion d'erreurs avec messages explicites
- Middleware d'authentification JWT
- Protection des routes sensibles
- Vérification des doublons (email, pseudo)
- Validation des données d'entrée

## Améliorations futures

- Mode multijoueur en temps réel
- Classements globaux et hebdomadaires
- Achievements supplémentaires (par boss spécifique, combos)
- Mode "Boss du jour" avec timer
- Partage de résultats sur réseaux sociaux
- Indices progressifs (coût en points)
- Mode difficile (moins d'indices)
- Support d'autres jeux FromSoftware (Armored Core)
- Notifications push pour nouveaux achievements
- Export/import de profils
- Mode sombre/clair personnalisable

## Technologies et bibliothèques

### Backend

- express 4.18+
- mongoose 8.0+
- jsonwebtoken 9.0+
- bcrypt 5.1+
- dotenv 16.0+
- cors
- swagger-ui-express

### Frontend

- @angular/core 18+
- @angular/common
- @angular/router
- rxjs 7.8+
- typescript 5.4+

## Crédits

Développé par Cyrian Torrejon (Sinfix)

Projet réalisé dans le cadre du module R5.08
