const express = require("express");
const router = express.Router();

module.exports = (data, saveData) => {
  // GET /boss - Liste tous les boss
  router.get("/", (req, res) => {
    const { page = 1, limit = 20, jeu, optionnel, dlc } = req.query;

    let filteredBoss = [...data.boss];

    // Filtres
    if (jeu) filteredBoss = filteredBoss.filter((b) => b.jeu === jeu);
    if (optionnel)
      filteredBoss = filteredBoss.filter((b) => b.optionnel === optionnel);
    if (dlc) filteredBoss = filteredBoss.filter((b) => b.dlc === dlc);

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedBoss = filteredBoss.slice(startIndex, endIndex);

    res.json({
      boss: paginatedBoss.map((b) => b.nom), // Noms uniquement pour ne pas spoiler
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredBoss.length,
        totalPages: Math.ceil(filteredBoss.length / limit),
      },
    });
  });

  // GET /boss/:nom - Détails d'un boss
  router.get("/:nom", (req, res) => {
    const boss = data.boss.find((b) => b.nom === req.params.nom);
    if (!boss) return res.status(404).json({ error: "Boss non trouvé" });
    res.json(boss);
  });

  // POST /boss - Ajouter un boss
  router.post("/", (req, res) => {
    const boss = req.body;
    if (data.boss.find((b) => b.nom === boss.nom)) {
      return res.status(400).json({ error: "Un boss avec ce nom existe déjà" });
    }
    data.boss.push(boss);
    saveData();
    res.status(201).json(boss);
  });

  // PUT /boss/:nom - Modifier un boss
  router.put("/:nom", (req, res) => {
    const index = data.boss.findIndex((b) => b.nom === req.params.nom);
    if (index === -1) return res.status(404).json({ error: "Boss non trouvé" });
    data.boss[index] = { ...data.boss[index], ...req.body };
    saveData();
    res.json(data.boss[index]);
  });

  // DELETE /boss/:nom - Supprimer un boss
  router.delete("/:nom", (req, res) => {
    const index = data.boss.findIndex((b) => b.nom === req.params.nom);
    if (index === -1) return res.status(404).json({ error: "Boss non trouvé" });
    data.boss.splice(index, 1);
    saveData();
    res.json({ message: "Boss supprimé" });
  });

  return router;
};
