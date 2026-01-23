const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Importer tous les modèles
const Boss = require("./models/Boss");
const Souls = require("./models/Souls");
const Achievement = require("./models/Achievement");
const JoueurAchievement = require("./models/JoueurAchievement");

const seedDatabase = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connecté à MongoDB");

    // Charger les données depuis soulsdle.json
    const dataPath = path.join(__dirname, "..", "soulsdle.json");
    const jsonData = JSON.parse(fs.readFileSync(dataPath, "utf8"));

    // Suppression des données existantes
    console.log("\n🗑️  Suppression des données existantes...");
    await Boss.deleteMany({});
    await Souls.deleteMany({});
    await Achievement.deleteMany({});
    await JoueurAchievement.deleteMany({});
    console.log("   ✅ Données supprimées");

    // Insertion des Boss
    console.log("\n⚔️  Insertion des boss...");
    await Boss.insertMany(jsonData.boss);
    console.log(`   ✅ ${jsonData.boss.length} boss insérés`);

    // Insertion des Souls
    console.log("\n🎮 Insertion des jeux Souls...");
    await Souls.insertMany(jsonData.souls);
    console.log(`   ✅ ${jsonData.souls.length} jeux Souls insérés`);

    // Insertion des Achievements
    console.log("\n🏆 Insertion des achievements...");
    const achievements = [
      {
        id: "achievement-first-blood",
        nom: "Premier sang",
        description: "Gagner votre première partie",
        icone: "🩸",
        categorie: "Progression",
        rarete: "Commun",
        condition: {
          type: "parties_gagnees",
          valeur: 1,
        },
        ordre: 1,
      },
      {
        id: "achievement-hot-streak",
        nom: "Hot streak",
        description: "Atteindre une série de 10 jours consécutifs",
        icone: "🔥",
        categorie: "Compétence",
        rarete: "Rare",
        condition: {
          type: "streak",
          valeur: 10,
        },
        ordre: 2,
      },
      {
        id: "achievement-roi-souls",
        nom: "Roi des Souls",
        description: "Atteindre une série de 50 jours consécutifs",
        icone: "👑",
        categorie: "Compétence",
        rarete: "Légendaire",
        condition: {
          type: "meilleure_streak",
          valeur: 50,
        },
        ordre: 3,
      },
      {
        id: "achievement-sniper",
        nom: "Sniper",
        description: "Gagner 3 parties en 3 tentatives ou moins",
        icone: "🎯",
        categorie: "Compétence",
        rarete: "Rare",
        condition: {
          type: "tentatives_parfaites",
          valeur: 3,
          tentativesMax: 3,
        },
        ordre: 4,
      },
      {
        id: "achievement-chanceux",
        nom: "Chanceux",
        description: "Gagner une partie en 1 seule tentative",
        icone: "🍀",
        categorie: "Compétence",
        rarete: "Épique",
        condition: {
          type: "tentatives_parfaites",
          valeur: 1,
          tentativesMax: 1,
        },
        ordre: 5,
      },
      {
        id: "achievement-perseverant",
        nom: "Persévérant",
        description: "Jouer 100 parties",
        icone: "💀",
        categorie: "Progression",
        rarete: "Rare",
        condition: {
          type: "total_parties",
          valeur: 100,
        },
        ordre: 6,
      },
      {
        id: "achievement-hunter",
        nom: "Hunter",
        description: "Gagner 50 parties avec des boss de Bloodborne",
        icone: "🩸",
        categorie: "Collection",
        rarete: "Épique",
        condition: {
          type: "victoire_jeu",
          valeur: 50,
          jeu: "Bloodborne",
        },
        ordre: 7,
      },
      {
        id: "achievement-chosen-undead",
        nom: "Chosen Undead",
        description: "Gagner 50 parties avec des boss de Dark Souls",
        icone: "🔥",
        categorie: "Collection",
        rarete: "Épique",
        condition: {
          type: "victoire_jeu",
          valeur: 50,
          jeu: "Dark Souls",
        },
        ordre: 8,
      },
      {
        id: "achievement-ashen-one",
        nom: "Ashen One",
        description: "Gagner 50 parties avec des boss de Dark Souls III",
        icone: "🌑",
        categorie: "Collection",
        rarete: "Épique",
        condition: {
          type: "victoire_jeu",
          valeur: 50,
          jeu: "Dark Souls III",
        },
        ordre: 9,
      },
      {
        id: "achievement-shinobi",
        nom: "Shinobi",
        description: "Gagner 50 parties avec des boss de Sekiro",
        icone: "🌸",
        categorie: "Collection",
        rarete: "Épique",
        condition: {
          type: "victoire_jeu",
          valeur: 50,
          jeu: "Sekiro",
        },
        ordre: 10,
      },
    ];
    await Achievement.insertMany(achievements);
    console.log(`   ✅ ${achievements.length} achievements insérés`);

    console.log("\n✅ Seed complet terminé avec succès !");
    console.log("\n📊 Résumé :");
    console.log(`   - ${jsonData.boss.length} boss`);
    console.log(`   - ${jsonData.souls.length} jeux Souls`);
    console.log(`   - ${achievements.length} achievements`);
    console.log(
      "\n💡 Vous pouvez maintenant créer un compte et commencer à jouer !",
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors du seed:", error);
    process.exit(1);
  }
};

seedDatabase();
