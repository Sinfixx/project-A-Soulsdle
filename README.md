# Project A - Soulsdle API - R5.08

## Spécification du système

Soulsdle est un jeu de devinettes inspiré de Wordle, mais centré sur les boss (adversaires majeurs) des jeux Souls de FromSoftware (Bloodborne, Sekiro, Dark Souls, Elden Ring...).

Pour plus d'infos : https://fr.wikipedia.org/wiki/Souls

### Concept du jeu

- Un boss est sélectionné aléatoirement
- Le joueur doit deviner le bon boss en le moins de tentative possible
- Après chaque proposition, des indices sont donnés sous forme de couleurs :
  - 🟢 Vert : Propriété correcte
  - 🟡 Jaune : Propriété partiellement correcte (pour les espèces multiples)
  - 🔴 Rouge : Propriété incorrecte

### Entités métier

#### Boss

- **nom** : Nom du boss (identifiant unique)
- **jeu** : Jeu d'origine (Bloodborne, Sekiro, etc.)
- **genre** : Homme, Femme, Inconnu
- **espece** : Liste d'espèces (Humain, Bête, Grand Ancien, etc.)
- **phases** : Nombre de phases du combat (de 1 à 3)
- **nombre** : Nombre d'entités ("1", "2", "3", ">10")
- **cutscene** : Présence d'une cinématique avant, pendant ou après le combat (Oui/Non)
- **optionnel** : Boss optionnel ou obligatoire (Obligatoire/Optionnel)
- **dlc** : Boss de DLC (DLC/Base)

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

Le jeu de données est maintenant structuré en **5 tables/collections** JSON :

### 1. Boss (`boss`)

Collection des boss à deviner avec leurs caractéristiques :

- **87 boss** au total (Bloodborne, Sekiro, Dark Souls III, Dark Souls)
- Propriétés : nom, jeu, genre, espèce, phases, nombre, cutscene, optionnel, dlc

### 2. Souls (`souls`)

Informations sur les jeux FromSoftware supportés :

- Bloodborne (2015) - 22 boss
- Sekiro (2019) - 15 boss
- Dark Souls III (2016) - 25 boss
- Dark Souls (2011) - 25 boss

### 3. Joueurs (`joueurs`)

Profils des joueurs inscrits :

- Pseudonyme, date d'inscription
- Statistiques personnelles (parties jouées)
- Boss favoris
- Système de streaks : streak actuelle, meilleure streak, dernier jour joué

### 4. Parties (`parties`)

Historique des parties jouées :

- ID unique, dates de début/fin
- Boss secret, nombre de tentatives
- Statut de réussite, joueur associé

### 5. Statistiques (`statistiques`)

Métriques globales du jeu :

- Nombre total de parties et joueurs
- Boss le plus deviné, moyennes
- Taux de réussite global

## Instructions pour exécuter le serveur

### Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn

### Installation

```bash
# Installer les dépendances
npm install

cd backend

# Lancer le serveur de développement
npm run dev

# Lancer en production
npm start

cd frontend

# Lancer le serveur frontend
python -m http.server 8080
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

- ✅ **5 tables/collections** : Boss, Jeux, Joueurs, Parties, Statistiques
- ✅ CRUD complet sur toutes les entités
- ✅ Système de parties et de devinettes avec indices colorés
- ✅ Gestion des joueurs et profils
- ✅ Statistiques globales et personnelles
- ✅ Filtrage et pagination sur toutes les collections
- ✅ Validation des données et gestion d'erreurs

### Bonus

- [ ] Liens HATEOAS
- [ ] Liens avec base NoSQL
- [ ] Client web Angular
- [ ] Authentification utilisateur
- [ ] Classements et profils

## Endpoints principaux

### Boss

- `GET /boss` - Liste des boss
- `GET /boss/{nom}` - Détails d'un boss
- `POST /boss` - Ajouter un boss
- `PUT /boss/{nom}` - Modifier un boss
- `DELETE /boss/{nom}` - Supprimer un boss

### Souls

- `GET /souls` - Liste des Souls
- `GET /souls/{id}` - Détails d'un Souls
- `POST /souls` - Ajouter un Souls
- `PUT /souls/{id}` - Modifier un Souls
- `DELETE /souls/{id}` - Supprimer un Souls

### Joueurs

- `GET /joueurs` - Liste des joueurs
- `GET /joueurs/{id}` - Profil d'un joueur
- `POST /joueurs` - Créer un joueur
- `PUT /joueurs/{id}` - Modifier un joueur
- `DELETE /joueurs/{id}` - Supprimer un joueur

### Parties

- `GET /parties` - Historique des parties (avec filtres)
- `GET /parties/{id}` - Détails d'une partie
- `POST /parties` - Créer une partie
- `PUT /parties/{id}` - Modifier une partie
- `DELETE /parties/{id}` - Supprimer une partie

### Jeu & Statistiques

- `GET /jeu` - Nouvelle partie
- `POST /jeu/guess` - Soumettre une proposition
- `GET /stats` - Statistiques globales

## Système de Streaks

Le système de streaks permet de suivre l'assiduité des joueurs :

- **streakActuelle** : Nombre de jours consécutifs avec au moins une partie terminée (réinitialisée si un jour est manqué)
- **meilleureStreak** : Record personnel du joueur
- **dernierJourJoue** : Date du dernier jour où une partie a été terminée

### Logique de calcul

- La streak augmente de 1 si le joueur termine une partie un jour consécutif
- La streak est réinitialisée à 0 si plus d'un jour s'est écoulé depuis la dernière partie terminée
- La meilleure streak est mise à jour si la streak actuelle la dépasse
- Plusieurs parties terminées le même jour ne comptent qu'une seule fois

## Crédits

Cyrian Torrejon | Sinfix
