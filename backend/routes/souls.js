const express = require("express");
const router = express.Router();
const Souls = require("../models/Souls");

module.exports = () => {
  // GET /souls - Liste tous les Souls
  router.get("/", async (req, res) => {
    try {
      const { page = 1, limit = 20 } = req.query;
      const skip = (page - 1) * parseInt(limit);
      const total = await Souls.countDocuments();
      const souls = await Souls.find().skip(skip).limit(parseInt(limit));

      res.json({
        souls,
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

  // GET /souls/:id
  router.get("/:id", async (req, res) => {
    try {
      const soul = await Souls.findOne({ id: req.params.id });
      if (!soul) return res.status(404).json({ error: "Souls non trouvé" });
      res.json(soul);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /souls
  router.post("/", async (req, res) => {
    try {
      const soul = new Souls(req.body);
      await soul.save();
      res.status(201).json(soul);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // PUT /souls/:id
  router.put("/:id", async (req, res) => {
    try {
      const soul = await Souls.findOneAndUpdate(
        { id: req.params.id },
        req.body,
        { new: true, runValidators: true }
      );
      if (!soul) return res.status(404).json({ error: "Souls non trouvé" });
      res.json(soul);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // DELETE /souls/:id
  router.delete("/:id", async (req, res) => {
    try {
      const soul = await Souls.findOneAndDelete({ id: req.params.id });
      if (!soul) return res.status(404).json({ error: "Souls non trouvé" });
      res.json({ message: "Souls supprimé" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
