const express = require("express");
const router = express.Router();
const Boss = require("../models/Boss");

module.exports = () => {
  // GET /boss - Liste tous les boss
  router.get("/", async (req, res) => {
    try {
      const { page = 1, limit = 20, jeu, optionnel, dlc } = req.query;

      // Construire le filtre
      let filter = {};
      if (jeu) filter.jeu = jeu;
      if (optionnel) filter.optionnel = optionnel;
      if (dlc) filter.dlc = dlc;

      // Pagination
      const skip = (page - 1) * parseInt(limit);
      const total = await Boss.countDocuments(filter);
      const boss = await Boss.find(filter)
        .select("nom")
        .skip(skip)
        .limit(parseInt(limit));

      res.json({
        boss: boss.map((b) => b.nom),
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

  // GET /boss/:nom - Détails d'un boss
  router.get("/:nom", async (req, res) => {
    try {
      const boss = await Boss.findOne({ nom: req.params.nom }).lean();
      if (!boss) return res.status(404).json({ error: "Boss non trouvé" });

      // Supprimer les métadonnées MongoDB
      delete boss._id;
      delete boss.__v;
      delete boss.createdAt;
      delete boss.updatedAt;

      res.json(boss);
    } catch (error) {
      console.error("❌ Erreur GET /boss/:nom:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // POST /boss - Ajouter un boss
  router.post("/", async (req, res) => {
    try {
      const existingBoss = await Boss.findOne({ nom: req.body.nom });
      if (existingBoss) {
        return res
          .status(400)
          .json({ error: "Un boss avec ce nom existe déjà" });
      }

      const boss = new Boss(req.body);
      await boss.save();

      // Convertir en objet simple et supprimer les métadonnées
      const bossObject = boss.toObject();
      delete bossObject._id;
      delete bossObject.__v;
      delete bossObject.createdAt;
      delete bossObject.updatedAt;

      res.status(201).json(bossObject);
    } catch (error) {
      console.error("❌ Erreur POST /boss:", error);
      res.status(400).json({ error: error.message });
    }
  });

  // PUT /boss/:nom - Modifier un boss
  router.put("/:nom", async (req, res) => {
    try {
      const boss = await Boss.findOneAndUpdate(
        { nom: req.params.nom },
        req.body,
        { new: true, runValidators: true },
      ).lean();

      if (!boss) return res.status(404).json({ error: "Boss non trouvé" });

      // Supprimer les métadonnées MongoDB
      delete boss._id;
      delete boss.__v;
      delete boss.createdAt;
      delete boss.updatedAt;

      res.json(boss);
    } catch (error) {
      console.error("❌ Erreur PUT /boss/:nom:", error);
      res.status(400).json({ error: error.message });
    }
  });

  // DELETE /boss/:nom - Supprimer un boss
  router.delete("/:nom", async (req, res) => {
    try {
      const boss = await Boss.findOneAndDelete({ nom: req.params.nom });
      if (!boss) return res.status(404).json({ error: "Boss non trouvé" });
      res.json({ message: "Boss supprimé" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
