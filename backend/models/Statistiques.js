const mongoose = require("mongoose");

const statistiquesSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: "global",
    },
    totalParties: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalJoueurs: {
      type: Number,
      default: 0,
      min: 0,
    },
    bossLesPlusDevines: [
      {
        nom: String,
        fois: Number,
      },
    ],
    bossLesMoinsTrouves: [
      {
        nom: String,
        tauxEchec: Number,
      },
    ],
    moyenneEssais: {
      type: Number,
      default: 0,
      min: 0,
    },
    derniereMaj: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "statistiques",
  }
);

module.exports = mongoose.model("Statistiques", statistiquesSchema);
