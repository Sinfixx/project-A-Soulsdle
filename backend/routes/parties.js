const express = require("express");
const router = express.Router();
const Partie = require("../models/Partie");
const Joueur = require("../models/Joueur");

module.exports = () => {
  // GET /parties
  router.get("/", async (req, res) => {
    try {
      const { page = 1, limit = 20, joueurId, terminee } = req.query;

      let filter = {};
      if (joueurId) filter.joueurId = joueurId;
      if (terminee !== undefined) filter.terminee = terminee === "true";

      const skip = (page - 1) * parseInt(limit);
      const total = await Partie.countDocuments(filter);
      const parties = await Partie.find(filter)
        .skip(skip)
        .limit(parseInt(limit));

      res.json({
        parties,
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

  // GET /parties/:id
  router.get("/:id", async (req, res) => {
    try {
      const partie = await Partie.findOne({ id: req.params.id });
      if (!partie) return res.status(404).json({ error: "Partie non trouvée" });
      res.json(partie);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /parties
  router.post("/", async (req, res) => {
    try {
      const partie = new Partie(req.body);
      await partie.save();
      res.status(201).json(partie);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // PUT /parties/:id - Mise à jour avec gestion des streaks
  router.put("/:id", async (req, res) => {
    try {
      const anciennePartie = await Partie.findOne({ id: req.params.id });
      if (!anciennePartie)
        return res.status(404).json({ error: "Partie non trouvée" });

      const nouvellePartie = await Partie.findOneAndUpdate(
        { id: req.params.id },
        req.body,
        { new: true, runValidators: true }
      );

      // Si la partie vient d'être terminée, mettre à jour les streaks
      if (!anciennePartie.terminee && nouvellePartie.terminee) {
        const joueur = await Joueur.findOne({ id: nouvellePartie.joueurId });
        if (joueur) {
          const aujourdhui = new Date().toISOString().split("T")[0];

          if (!joueur.dernierJourJoue) {
            // Première partie terminée
            joueur.streakActuelle = 1;
            joueur.meilleureStreak = 1;
          } else if (joueur.dernierJourJoue === aujourdhui) {
            // Même jour, ne rien changer
          } else {
            const dernierJour = new Date(joueur.dernierJourJoue);
            const aujourdhuiDate = new Date(aujourdhui);
            const diffJours = Math.floor(
              (aujourdhuiDate - dernierJour) / (1000 * 60 * 60 * 24)
            );

            if (diffJours === 1) {
              // Jour consécutif
              joueur.streakActuelle += 1;
              if (joueur.streakActuelle > joueur.meilleureStreak) {
                joueur.meilleureStreak = joueur.streakActuelle;
              }
            } else {
              // Streak brisée
              joueur.streakActuelle = 1;
            }
          }

          joueur.dernierJourJoue = aujourdhui;
          joueur.partiesTerminees = (joueur.partiesTerminees || 0) + 1;
          await joueur.save();
        }
      }

      res.json(nouvellePartie);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // DELETE /parties/:id
  router.delete("/:id", async (req, res) => {
    try {
      const partie = await Partie.findOneAndDelete({ id: req.params.id });
      if (!partie) return res.status(404).json({ error: "Partie non trouvée" });
      res.json({ message: "Partie supprimée" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
