const express = require("express");
const router = express.Router();

module.exports = (data, saveData) => {
  // GET /joueurs
  router.get("/", (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);

    res.json({
      joueurs: data.joueurs.slice(startIndex, endIndex),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: data.joueurs.length,
        totalPages: Math.ceil(data.joueurs.length / limit),
      },
    });
  });

  // GET /joueurs/:id
  router.get("/:id", (req, res) => {
    const joueur = data.joueurs.find((j) => j.id === req.params.id);
    if (!joueur) return res.status(404).json({ error: "Joueur non trouvé" });
    res.json(joueur);
  });

  // POST /joueurs
  router.post("/", (req, res) => {
    const joueur = {
      ...req.body,
      streakActuelle: 0,
      meilleureStreak: 0,
      dernierJourJoue: null,
    };
    data.joueurs.push(joueur);
    saveData();
    res.status(201).json(joueur);
  });

  // PUT /joueurs/:id
  router.put("/:id", (req, res) => {
    const index = data.joueurs.findIndex((j) => j.id === req.params.id);
    if (index === -1)
      return res.status(404).json({ error: "Joueur non trouvé" });
    data.joueurs[index] = { ...data.joueurs[index], ...req.body };
    saveData();
    res.json(data.joueurs[index]);
  });

  // DELETE /joueurs/:id
  router.delete("/:id", (req, res) => {
    const index = data.joueurs.findIndex((j) => j.id === req.params.id);
    if (index === -1)
      return res.status(404).json({ error: "Joueur non trouvé" });
    data.joueurs.splice(index, 1);
    saveData();
    res.json({ message: "Joueur supprimé" });
  });

  return router;
};
