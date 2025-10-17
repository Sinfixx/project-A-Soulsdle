const express = require("express");
const router = express.Router();

module.exports = (data) => {
  // GET /stats
  router.get("/", (req, res) => {
    if (data.statistiques.length > 0) {
      res.json(data.statistiques[0]);
    } else {
      res.json({
        id: "stats-globales",
        totalParties: data.parties.length,
        totalJoueurs: data.joueurs.length,
        derniereMaj: new Date().toISOString(),
      });
    }
  });

  return router;
};
