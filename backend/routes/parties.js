const express = require("express");
const router = express.Router();

module.exports = (data, saveData) => {
  // GET /parties
  router.get("/", (req, res) => {
    const { page = 1, limit = 20, joueurId, terminee } = req.query;

    let filteredParties = [...data.parties];

    if (joueurId)
      filteredParties = filteredParties.filter((p) => p.joueurId === joueurId);
    if (terminee !== undefined)
      filteredParties = filteredParties.filter(
        (p) => p.terminee === (terminee === "true")
      );

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);

    res.json({
      parties: filteredParties.slice(startIndex, endIndex),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredParties.length,
        totalPages: Math.ceil(filteredParties.length / limit),
      },
    });
  });

  // GET /parties/:id
  router.get("/:id", (req, res) => {
    const partie = data.parties.find((p) => p.id === req.params.id);
    if (!partie) return res.status(404).json({ error: "Partie non trouvée" });
    res.json(partie);
  });

  // POST /parties
  router.post("/", (req, res) => {
    data.parties.push(req.body);
    saveData();
    res.status(201).json(req.body);
  });

  // PUT /parties/:id - Mise à jour avec gestion des streaks
  router.put("/:id", (req, res) => {
    const index = data.parties.findIndex((p) => p.id === req.params.id);
    if (index === -1)
      return res.status(404).json({ error: "Partie non trouvée" });

    const anciennePartie = data.parties[index];
    const nouvellePartie = { ...anciennePartie, ...req.body };
    data.parties[index] = nouvellePartie;

    // Si la partie vient d'être terminée, mettre à jour les streaks
    if (!anciennePartie.terminee && nouvellePartie.terminee) {
      const joueurIndex = data.joueurs.findIndex(
        (j) => j.id === nouvellePartie.joueurId
      );
      if (joueurIndex !== -1) {
        const joueur = data.joueurs[joueurIndex];
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
        data.joueurs[joueurIndex] = joueur;
      }
    }

    saveData();
    res.json(nouvellePartie);
  });

  // DELETE /parties/:id
  router.delete("/:id", (req, res) => {
    const index = data.parties.findIndex((p) => p.id === req.params.id);
    if (index === -1)
      return res.status(404).json({ error: "Partie non trouvée" });
    data.parties.splice(index, 1);
    saveData();
    res.json({ message: "Partie supprimée" });
  });

  return router;
};
