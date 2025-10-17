# Frontend Soulsdle - Test Rapide

## Description

Interface HTML/JS/CSS minimaliste pour tester l'API Soulsdle sans framework.

## Fonctionnalités

### 🎯 Onglet Jeu
- Démarrer une nouvelle partie
- Proposer un boss avec autocomplétion
- Voir les indices colorés :
  - 🟢 Vert = Correct
  - 🟡 Orange = Partiel
  - 🔴 Rouge = Incorrect
- Compteur de tentatives

### 👹 Onglet Boss
- Liste de tous les boss
- Filtres par jeu et DLC
- Détails d'un boss spécifique

### 🎮 Onglet Souls
- Liste des jeux FromSoftware disponibles

### 👤 Onglet Joueurs
- Liste des joueurs
- Créer un nouveau joueur

### 📊 Onglet Parties
- Historique des parties jouées

### 📈 Onglet Stats
- Statistiques globales du jeu

## Utilisation

1. **Démarrer le backend** :
   ```bash
   cd backend
   npm start
   ```

2. **Ouvrir le frontend** :
   - Ouvrir `index.html` directement dans votre navigateur
   - OU utiliser un serveur local :
     ```bash
     # Avec Python 3
     python -m http.server 8080
     
     # Avec Node.js (npx)
     npx http-server -p 8080
     ```
   - Puis accéder à `http://localhost:8080`

## Configuration

L'URL de l'API est définie dans le fichier `index.html` :
```javascript
const API_URL = 'http://localhost:3000';
```

Si votre backend tourne sur un autre port, modifiez cette valeur.

## Notes

- **Pas de framework** : HTML/CSS/JS vanilla
- **CSS minimal** : Thème sombre simple
- **CORS** : Le backend doit avoir CORS activé (déjà fait avec `cors()` dans Express)
- **Compatible** : Tous les navigateurs modernes

## Exemple de jeu

1. Cliquez sur "Nouvelle Partie"
2. Tapez le nom d'un boss (autocomplétion disponible)
3. Cliquez sur "Proposer"
4. Regardez les indices colorés
5. Continuez jusqu'à trouver le bon boss !
