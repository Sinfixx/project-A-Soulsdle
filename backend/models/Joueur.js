const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const joueurSchema = new mongoose.Schema(
  {
    // Données d'authentification
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
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // Statistiques visibles par l'utilisateur
    partiesGagnees: {
      type: Number,
      default: 0,
      min: 0,
    },
    streakActuelle: {
      type: Number,
      default: 0,
      min: 0,
    },
    meilleureStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    collection: "joueurs",
  },
);

// Hash password avant sauvegarde
joueurSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer les mots de passe
joueurSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Ne pas retourner le password dans les réponses JSON
joueurSchema.methods.toJSON = function () {
  const obj = this.toObject({ virtuals: true });
  delete obj.password;
  return obj;
};

joueurSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Joueur", joueurSchema);
