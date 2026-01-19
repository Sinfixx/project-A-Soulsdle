const express = require("express");
const router = express.Router();
const Joueur = require("../models/Joueur");

module.exports = () => {
  // GET /joueurs
  router.get("/", async (req, res) => {
    try {
      const { page = 1, limit = 20 } = req.query;
      const skip = (page - 1) * parseInt(limit);
      const total = await Joueur.countDocuments();
      const joueurs = await Joueur.find().skip(skip).limit(parseInt(limit));

      res.json({
        joueurs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /joueurs/:id
  router.get("/:id", async (req, res) => {
    try {
      const joueur = await Joueur.findOne({ id: req.params.id });
      if (!joueur) return res.status(404).json({ error: "Joueur non trouvé" });
      res.json(joueur);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /joueurs
  router.post("/", async (req, res) => {
    try {
      const joueur = new Joueur({
        ...req.body,
        streakActuelle: 0,
        meilleureStreak: 0,
      });
      await joueur.save();
      res.status(201).json(joueur);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // PUT /joueurs/:id
  router.put("/:id", async (req, res) => {
    try {
      const joueur = await Joueur.findOneAndUpdate(
        { id: req.params.id },
        req.body,
        { new: true, runValidators: true },
      );
      if (!joueur) return res.status(404).json({ error: "Joueur non trouvé" });
      res.json(joueur);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // DELETE /joueurs/:id
  router.delete("/:id", async (req, res) => {
    try {
      const joueur = await Joueur.findOneAndDelete({ id: req.params.id });
      if (!joueur) return res.status(404).json({ error: "Joueur non trouvé" });
      res.json({ message: "Joueur supprimé" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
