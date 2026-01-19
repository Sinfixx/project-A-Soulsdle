const mongoose = require("mongoose");

const joueurSchema = new mongoose.Schema(
  {
    pseudo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    partiesJouees: {
      type: Number,
      default: 0,
      min: 0,
    },
    partiesGagnees: {
      type: Number,
      default: 0,
      min: 0,
    },
    dernierJourJoue: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "joueurs",
  }
);

// Méthodes virtuelles
joueurSchema.virtual("tauxVictoire").get(function () {
  if (this.partiesJouees === 0) return 0;
  return ((this.partiesGagnees / this.partiesJouees) * 100).toFixed(2);
});

joueurSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Joueur", joueurSchema);
