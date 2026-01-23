const mongoose = require("mongoose");

const joueurAchievementSchema = new mongoose.Schema(
  {
    joueurId: {
      type: String,
      required: true,
      ref: "Joueur",
    },
    achievementId: {
      type: String,
      required: true,
      ref: "Achievement",
    },
    dateDeblocage: {
      type: Date,
      required: true,
      default: Date.now,
    },
    progression: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },
    progressionActuelle: {
      type: Number,
      default: 0,
      min: 0,
    },
    progressionRequise: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "joueur_achievements",
  },
);

// Index pour performance
joueurAchievementSchema.index(
  { joueurId: 1, achievementId: 1 },
  { unique: true },
);
joueurAchievementSchema.index({ achievementId: 1 });
joueurAchievementSchema.index({ dateDeblocage: -1 });
joueurAchievementSchema.index({ joueurId: 1, dateDeblocage: -1 });

module.exports = mongoose.model("JoueurAchievement", joueurAchievementSchema);
