const express = require("express");
const router = express.Router();
const Achievement = require("../models/Achievement");
const JoueurAchievement = require("../models/JoueurAchievement");
const achievementService = require("../services/achievementService");
const { authenticateToken } = require("../middleware/auth");

module.exports = () => {
  // GET /achievements - Liste tous les achievements avec statistiques globales
  router.get("/", async (req, res) => {
    try {
      const achievements =
        await achievementService.getAllAchievementsWithStats();
      res.json({ achievements });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /achievements/me - Achievements du joueur connecté
  router.get("/me", authenticateToken, async (req, res) => {
    try {
      const joueurId = req.joueur._id;

      const { unlocked, inProgress } =
        await achievementService.getJoueurAchievements(joueurId);

      res.json({
        unlocked,
        inProgress,
        totalUnlocked: unlocked.length,
        totalAchievements: await Achievement.countDocuments(),
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /achievements/:id - Détails d'un achievement spécifique
  router.get("/:id", async (req, res) => {
    try {
      const achievement = await Achievement.findOne({ id: req.params.id });
      if (!achievement) {
        return res.status(404).json({ error: "Achievement non trouvé" });
      }

      const stats = await achievementService.getAchievementStats(req.params.id);

      res.json({
        ...achievement.toObject(),
        ...stats,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /achievements/:id/check - Vérifier manuellement un achievement pour un joueur (admin/debug)
  router.post("/:id/check", authenticateToken, async (req, res) => {
    try {
      const joueurId = req.joueur._id;
      const achievementId = req.params.id;

      const achievement = await Achievement.findOne({ id: achievementId });
      if (!achievement) {
        return res.status(404).json({ error: "Achievement non trouvé" });
      }

      const newAchievements =
        await achievementService.checkAndUnlockAchievements(joueurId);

      const unlocked = newAchievements.some((a) => a.id === achievementId);

      res.json({
        unlocked,
        achievement: unlocked ? achievement : null,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /achievements/check-all - Vérifier tous les achievements pour le joueur connecté
  router.post("/check-all", authenticateToken, async (req, res) => {
    try {
      const joueurId = req.joueur._id;
      const newAchievements =
        await achievementService.checkAndUnlockAchievements(joueurId);

      res.json({
        newAchievements,
        count: newAchievements.length,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
