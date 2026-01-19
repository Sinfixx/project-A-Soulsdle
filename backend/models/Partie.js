const mongoose = require("mongoose");

const partieSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    dateDebut: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dateFin: {
      type: Date,
      default: null,
    },
    bossSecret: {
      type: String,
      required: true,
    },
    tentatives: {
      type: Number,
      default: 0,
    },
    terminee: {
      type: Boolean,
      default: false,
    },
    joueurId: {
      type: String,
      required: true,
      ref: "Joueur",
    },
  },
  {
    timestamps: true,
  }
);

// Index pour améliorer les performances
partieSchema.index({ joueurId: 1 });
partieSchema.index({ terminee: 1 });
partieSchema.index({ dateDebut: -1 });

module.exports = mongoose.model("Partie", partieSchema);
