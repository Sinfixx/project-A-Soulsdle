const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Joueur = require("../models/Joueur");
const jwtConfig = require("../config/jwt");
const { authenticateToken } = require("../middleware/auth");

module.exports = () => {
  /**
   * POST /auth/register - Inscription
   */
  router.post("/register", async (req, res) => {
    try {
      const { pseudo, email, password } = req.body;

      // Validation des champs
      if (!pseudo || !email || !password) {
        return res.status(400).json({
          error: "Tous les champs sont requis (pseudo, email, password)",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          error: "Le mot de passe doit contenir au moins 6 caractères",
        });
      }

      // Vérifier si le joueur existe déjà
      const existingJoueur = await Joueur.findOne({
        $or: [{ email }, { pseudo }],
      });

      if (existingJoueur) {
        if (existingJoueur.email === email) {
          return res.status(400).json({ error: "Cet email est déjà utilisé" });
        }
        if (existingJoueur.pseudo === pseudo) {
          return res.status(400).json({ error: "Ce pseudo est déjà utilisé" });
        }
      }

      // Créer le nouveau joueur
      const joueur = new Joueur({
        pseudo,
        email,
        password, // Sera hashé automatiquement par le pre-save hook
        partiesGagnees: 0,
        streakActuelle: 0,
        meilleureStreak: 0,
      });

      await joueur.save();

      // Générer le token JWT
      const token = jwt.sign(
        {
          id: joueur._id,
          pseudo: joueur.pseudo,
          email: joueur.email,
        },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn },
      );

      res.status(201).json({
        message: "Inscription réussie",
        token,
        joueur: {
          id: joueur._id,
          pseudo: joueur.pseudo,
          email: joueur.email,
          partiesGagnees: joueur.partiesGagnees,
          streakActuelle: joueur.streakActuelle,
          meilleureStreak: joueur.meilleureStreak,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * POST /auth/login - Connexion
   */
  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validation des champs
      if (!email || !password) {
        return res.status(400).json({
          error: "Email et mot de passe requis",
        });
      }

      // Trouver le joueur (incluant le password pour la comparaison)
      const joueur = await Joueur.findOne({ email });

      if (!joueur) {
        return res.status(401).json({
          error: "Email ou mot de passe incorrect",
        });
      }

      // Vérifier le mot de passe
      const isPasswordValid = await joueur.comparePassword(password);

      if (!isPasswordValid) {
        return res.status(401).json({
          error: "Email ou mot de passe incorrect",
        });
      }

      // Générer le token JWT
      const token = jwt.sign(
        {
          id: joueur._id,
          pseudo: joueur.pseudo,
          email: joueur.email,
        },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn },
      );

      res.json({
        message: "Connexion réussie",
        token,
        joueur: {
          id: joueur._id,
          pseudo: joueur.pseudo,
          email: joueur.email,
          partiesGagnees: joueur.partiesGagnees,
          streakActuelle: joueur.streakActuelle,
          meilleureStreak: joueur.meilleureStreak,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * GET /auth/me - Récupérer les infos du joueur connecté
   */
  router.get("/me", authenticateToken, async (req, res) => {
    try {
      res.json({
        joueur: {
          id: req.joueur._id,
          pseudo: req.joueur.pseudo,
          email: req.joueur.email,
          partiesGagnees: req.joueur.partiesGagnees,
          streakActuelle: req.joueur.streakActuelle,
          meilleureStreak: req.joueur.meilleureStreak,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * POST /auth/verify - Vérifier si un token est valide
   */
  router.post("/verify", authenticateToken, async (req, res) => {
    res.json({ valid: true, joueur: req.joueur });
  });

  return router;
};
