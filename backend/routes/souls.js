const express = require("express");
const router = express.Router();

module.exports = (data, saveData) => {
  // GET /souls - Liste tous les Souls
  router.get("/", (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);

    res.json({
      souls: data.souls.slice(startIndex, endIndex),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: data.souls.length,
        totalPages: Math.ceil(data.souls.length / limit),
      },
    });
  });

  // GET /souls/:id
  router.get("/:id", (req, res) => {
    const soul = data.souls.find((s) => s.id === req.params.id);
    if (!soul) return res.status(404).json({ error: "Souls non trouvé" });
    res.json(soul);
  });

  // POST /souls
  router.post("/", (req, res) => {
    data.souls.push(req.body);
    saveData();
    res.status(201).json(req.body);
  });

  // PUT /souls/:id
  router.put("/:id", (req, res) => {
    const index = data.souls.findIndex((s) => s.id === req.params.id);
    if (index === -1)
      return res.status(404).json({ error: "Souls non trouvé" });
    data.souls[index] = { ...data.souls[index], ...req.body };
    saveData();
    res.json(data.souls[index]);
  });

  // DELETE /souls/:id
  router.delete("/:id", (req, res) => {
    const index = data.souls.findIndex((s) => s.id === req.params.id);
    if (index === -1)
      return res.status(404).json({ error: "Souls non trouvé" });
    data.souls.splice(index, 1);
    saveData();
    res.json({ message: "Souls supprimé" });
  });

  return router;
};
