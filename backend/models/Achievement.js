const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    nom: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    icone: {
      type: String,
      required: true,
    },
    categorie: {
      type: String,
      enum: ["Progression", "Compétence", "Collection", "Spécial"],
      required: true,
    },
    rarete: {
      type: String,
      enum: ["Commun", "Rare", "Épique", "Légendaire"],
      required: true,
    },
    condition: {
      type: {
        type: String,
        enum: [
          "parties_gagnees",
          "streak",
          "meilleure_streak",
          "tentatives_parfaites",
          "victoire_jeu",
          "total_parties",
        ],
        required: true,
      },
      valeur: {
        type: Number,
        required: true,
      },
      jeu: String, // Pour achievements spécifiques à un jeu
      tentativesMax: Number, // Pour "Sniper", "Chanceux"
    },
    ordre: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: "achievements",
  },
);

module.exports = mongoose.model("Achievement", achievementSchema);
