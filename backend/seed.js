const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Importer les modèles
const Boss = require("./models/Boss");
const Souls = require("./models/Souls");
const Joueur = require("./models/Joueur");
const Partie = require("./models/Partie");
const Statistiques = require("./models/Statistiques");

// Charger les données JSON
const dataPath = path.join(__dirname, "..", "soulsdle.json");
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

const seedDatabase = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connecté à MongoDB");

    // Supprimer les données existantes
    console.log("Suppression des données existantes...");
    await Boss.deleteMany({});
    await Souls.deleteMany({});
    await Joueur.deleteMany({});
    await Partie.deleteMany({});
    await Statistiques.deleteMany({});

    // Insérer les boss
    console.log("Insertion des boss...");
    await Boss.insertMany(data.boss);
    console.log(`${data.boss.length} boss insérés`);

    // Insérer les souls
    console.log("Insertion des jeux Souls...");
    await Souls.insertMany(data.souls);
    console.log(`${data.souls.length} jeux Souls insérés`);

    // Insérer les joueurs
    console.log("Insertion des joueurs...");
    await Joueur.insertMany(data.joueurs);
    console.log(`${data.joueurs.length} joueurs insérés`);

    // Insérer les parties
    console.log("Insertion des parties...");
    await Partie.insertMany(data.parties);
    console.log(`${data.parties.length} parties insérées`);

    // Insérer les statistiques
    console.log("Insertion des statistiques...");
    await Statistiques.insertMany(data.statistiques);
    console.log(`${data.statistiques.length} statistiques insérées`);

    console.log("Seed terminé avec succès !");
    process.exit(0);
  } catch (error) {
    console.error("Erreur lors du seed:", error);
    process.exit(1);
  }
};

seedDatabase();
