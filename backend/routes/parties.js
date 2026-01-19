const express = require("express");
const router = express.Router();
const Partie = require("../models/Partie");
const Joueur = require("../models/Joueur");
const { authenticateToken } = require("../middleware/auth");

module.exports = () => {
  // GET /parties (PROTÉGÉ)
  router.get("/", authenticateToken, async (req, res) => {
    try {
      const { page = 1, limit = 20, joueurId } = req.query;

      let filter = {};
      if (joueurId) filter.joueurId = joueurId;

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

  // GET /parties/:id (PROTÉGÉ)
  router.get("/:id", authenticateToken, async (req, res) => {
    try {
      const partie = await Partie.findOne({ id: req.params.id });
      if (!partie) return res.status(404).json({ error: "Partie non trouvée" });
      res.json(partie);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /parties (PROTÉGÉ)
  router.post("/", authenticateToken, async (req, res) => {
    try {
      const partie = new Partie(req.body);
      await partie.save();
      res.status(201).json(partie);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // PUT /parties/:id - Mise à jour (PROTÉGÉ)
  router.put("/:id", authenticateToken, async (req, res) => {
    try {
      const partie = await Partie.findOneAndUpdate(
        { id: req.params.id },
        req.body,
        { new: true, runValidators: true },
      );

      if (!partie) return res.status(404).json({ error: "Partie non trouvée" });

      res.json(partie);
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
