const mongoose = require("mongoose");

const soulsSchema = new mongoose.Schema(
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
    annee: {
      type: Number,
      required: true,
    },
    developpeur: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    plateforme: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Souls", soulsSchema);
