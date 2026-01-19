const express = require("express");
const router = express.Router();
const Statistiques = require("../models/Statistiques");
const Partie = require("../models/Partie");
const Joueur = require("../models/Joueur");

//Cette route va surement recevoir des améliorations quand l'application sera fini/plus aboutie

module.exports = () => {
  // GET /stats
  router.get("/", async (req, res) => {
    try {
      let stats = await Statistiques.findOne({ id: "stats-globales" });

      if (!stats) {
        // Créer les statistiques si elles n'existent pas
        const totalParties = await Partie.countDocuments();
        const totalJoueurs = await Joueur.countDocuments();

        stats = new Statistiques({
          id: "stats-globales",
          totalParties,
          totalJoueurs,
          derniereMaj: new Date().toISOString(),
        });
        await stats.save();
      }

      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
