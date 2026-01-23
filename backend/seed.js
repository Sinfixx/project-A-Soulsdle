const mongoose = require("mongoose");
require("dotenv").config();

// Importer uniquement les modèles nécessaires
const Achievement = require("./models/Achievement");
const JoueurAchievement = require("./models/JoueurAchievement");

const seedAchievements = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connecté à MongoDB");

    // Supprimer uniquement les achievements existants
    console.log("🗑️  Suppression des achievements existants...");
    await Achievement.deleteMany({});
    await JoueurAchievement.deleteMany({});
    console.log("   ✅ Achievements supprimés");

    // Insérer les achievements
    console.log("🏆 Insertion des achievements...");
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
        description: "Atteindre une série de 10 victoires consécutives",
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
        description: "Atteindre une série de 50 victoires consécutives",
        icone: "👑",
        categorie: "Compétence",
        rarete: "Épique",
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
        rarete: "Légendaire",
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
        rarete: "Légendaire",
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
        rarete: "Légendaire",
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
        rarete: "Légendaire",
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

    console.log("\n✅ Seed des achievements terminé avec succès !");
    console.log(
      "💡 Les autres données (boss, joueurs, parties) sont conservées.",
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors du seed:", error);
    process.exit(1);
  }
};

seedAchievements();
