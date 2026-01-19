const mongoose = require("mongoose");

const bossSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
      unique: true,
    },
    jeu: {
      type: String,
      required: true,
      enum: ["Bloodborne", "Sekiro", "Dark Souls III", "Dark Souls"],
    },
    genre: {
      type: String,
      required: true,
      enum: ["Homme", "Femme", "Inconnu"],
    },
    espece: [
      {
        type: String,
        required: true,
      },
    ],
    phases: {
      type: Number,
      required: true,
      min: 1,
    },
    nombre: {
      type: Number,
      required: true,
      min: 1,
    },
    cutscene: {
      type: String,
      required: true,
      enum: ["Oui", "Non"],
    },
    optionnel: {
      type: String,
      required: true,
      enum: ["Optionnel", "Obligatoire"],
    },
    dlc: {
      type: String,
      required: true,
      enum: ["Base", "DLC"],
    },
  },
  {
    timestamps: true,
    collection: "boss",
  }
);

module.exports = mongoose.model("Boss", bossSchema);
