const Achievement = require("../models/Achievement");
const JoueurAchievement = require("../models/JoueurAchievement");
const Joueur = require("../models/Joueur");
const Partie = require("../models/Partie");
const Boss = require("../models/Boss");

class AchievementService {
  /**
   * Vérifie et débloque les achievements après une partie gagnée
   */
  async checkAndUnlockAchievements(joueurId) {
    const joueur = await Joueur.findById(joueurId);
    if (!joueur) return [];

    const allAchievements = await Achievement.find();
    const unlockedAchievements = [];

    for (const achievement of allAchievements) {
      // Vérifier si déjà débloqué
      const existing = await JoueurAchievement.findOne({
        joueurId,
        achievementId: achievement.id,
      });

      if (existing && existing.progression === 1.0) {
        continue; // Déjà débloqué
      }

      // Vérifier la condition
      const shouldUnlock = await this.checkCondition(joueur, achievement);

      if (shouldUnlock) {
        await this.unlockAchievement(joueurId, achievement);
        unlockedAchievements.push(achievement);
      } else {
        // Mettre à jour la progression
        await this.updateProgression(joueurId, achievement, joueur);
      }
    }

    return unlockedAchievements;
  }

  /**
   * Vérifie si la condition d'un achievement est remplie
   */
  async checkCondition(joueur, achievement) {
    const { type, valeur, jeu, tentativesMax } = achievement.condition;

    switch (type) {
      case "parties_gagnees":
        return joueur.partiesGagnees >= valeur;

      case "streak":
        return joueur.streakActuelle >= valeur;

      case "meilleure_streak":
        return joueur.meilleureStreak >= valeur;

      case "tentatives_parfaites":
        // "Sniper" : X victoires en <= tentativesMax tentatives
        const perfectGames = await Partie.countDocuments({
          joueurId: joueur._id,
          tentatives: { $lte: tentativesMax },
        });
        return perfectGames >= valeur;

      case "victoire_jeu":
        // "Hunter" : X victoires sur un jeu spécifique
        const bossNames = await Boss.find({ jeu }).distinct("nom");
        const jeuWins = await Partie.countDocuments({
          joueurId: joueur._id,
          bossSecret: { $in: bossNames },
        });
        return jeuWins >= valeur;

      case "total_parties":
        const totalParties = await Partie.countDocuments({
          joueurId: joueur._id,
        });
        return totalParties >= valeur;

      default:
        return false;
    }
  }

  /**
   * Débloque un achievement
   */
  async unlockAchievement(joueurId, achievement) {
    await JoueurAchievement.findOneAndUpdate(
      { joueurId, achievementId: achievement.id },
      {
        joueurId,
        achievementId: achievement.id,
        dateDeblocage: new Date(),
        progression: 1.0,
        progressionActuelle: achievement.condition.valeur,
        progressionRequise: achievement.condition.valeur,
      },
      { upsert: true, new: true },
    );

    console.log(
      `🎉 Achievement débloqué: ${achievement.nom} pour joueur ${joueurId}`,
    );
  }

  /**
   * Met à jour la progression d'un achievement
   */
  async updateProgression(joueurId, achievement, joueur) {
    const { type, valeur, jeu, tentativesMax } = achievement.condition;
    let progressionActuelle = 0;

    switch (type) {
      case "parties_gagnees":
        progressionActuelle = joueur.partiesGagnees;
        break;

      case "streak":
        progressionActuelle = joueur.streakActuelle;
        break;

      case "meilleure_streak":
        progressionActuelle = joueur.meilleureStreak;
        break;

      case "tentatives_parfaites":
        const perfectGames = await Partie.countDocuments({
          joueurId: joueur._id,
          tentatives: { $lte: tentativesMax },
        });
        progressionActuelle = perfectGames;
        break;

      case "victoire_jeu":
        const bossNames = await Boss.find({ jeu }).distinct("nom");
        const jeuWins = await Partie.countDocuments({
          joueurId: joueur._id,
          bossSecret: { $in: bossNames },
        });
        progressionActuelle = jeuWins;
        break;

      case "total_parties":
        const totalParties = await Partie.countDocuments({
          joueurId: joueur._id,
        });
        progressionActuelle = totalParties;
        break;
    }

    const progression = Math.min(progressionActuelle / valeur, 1.0);

    await JoueurAchievement.findOneAndUpdate(
      { joueurId, achievementId: achievement.id },
      {
        joueurId,
        achievementId: achievement.id,
        progression,
        progressionActuelle,
        progressionRequise: valeur,
      },
      { upsert: true, new: true },
    );
  }

  /**
   * Récupère les achievements d'un joueur avec détails
   */
  async getJoueurAchievements(joueurId) {
    // Achievements débloqués
    const unlocked = await JoueurAchievement.find({
      joueurId,
      progression: 1.0,
    }).sort({ dateDeblocage: -1 });

    // Achievements en cours
    const inProgress = await JoueurAchievement.find({
      joueurId,
      progression: { $lt: 1.0 },
    }).sort({ progression: -1 });

    // Récupérer les détails des achievements
    const unlockedIds = unlocked.map((ua) => ua.achievementId);
    const inProgressIds = inProgress.map((ua) => ua.achievementId);

    const unlockedDetails = await Achievement.find({
      id: { $in: unlockedIds },
    });
    const inProgressDetails = await Achievement.find({
      id: { $in: inProgressIds },
    });

    // Mapper les détails
    const unlockedWithDetails = unlocked
      .map((ua) => {
        const achievement = unlockedDetails.find(
          (a) => a.id === ua.achievementId,
        );
        if (!achievement) {
          console.warn(`⚠️ Achievement ${ua.achievementId} non trouvé`);
          return null;
        }
        return {
          ...achievement.toObject(),
          dateDeblocage: ua.dateDeblocage,
        };
      })
      .filter((a) => a !== null);

    const inProgressWithDetails = inProgress
      .map((ua) => {
        const achievement = inProgressDetails.find(
          (a) => a.id === ua.achievementId,
        );
        if (!achievement) {
          console.warn(`⚠️ Achievement ${ua.achievementId} non trouvé`);
          return null;
        }
        return {
          ...achievement.toObject(),
          progression: ua.progression,
          progressionActuelle: ua.progressionActuelle,
          progressionRequise: ua.progressionRequise,
        };
      })
      .filter((a) => a !== null);

    return {
      unlocked: unlockedWithDetails,
      inProgress: inProgressWithDetails,
    };
  }

  /**
   * Statistiques globales d'un achievement
   */
  async getAchievementStats(achievementId) {
    const totalJoueurs = await Joueur.countDocuments();
    const unlockedCount = await JoueurAchievement.countDocuments({
      achievementId,
      progression: 1.0,
    });

    return {
      totalDeblocages: unlockedCount,
      pourcentage: totalJoueurs > 0 ? (unlockedCount / totalJoueurs) * 100 : 0,
    };
  }

  /**
   * Récupère tous les achievements avec leurs statistiques globales
   */
  async getAllAchievementsWithStats() {
    const achievements = await Achievement.find().sort({ ordre: 1 });
    const totalJoueurs = await Joueur.countDocuments();

    const achievementsWithStats = await Promise.all(
      achievements.map(async (achievement) => {
        const unlockedCount = await JoueurAchievement.countDocuments({
          achievementId: achievement.id,
          progression: 1.0,
        });

        return {
          ...achievement.toObject(),
          totalDeblocages: unlockedCount,
          pourcentage:
            totalJoueurs > 0 ? (unlockedCount / totalJoueurs) * 100 : 0,
        };
      }),
    );

    return achievementsWithStats;
  }
}

module.exports = new AchievementService();
