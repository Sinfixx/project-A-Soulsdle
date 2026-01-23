const express = require("express");
const router = express.Router();
const Boss = require("../models/Boss");
const Partie = require("../models/Partie");
const Joueur = require("../models/Joueur");
const { authenticateToken } = require("../middleware/auth");
const achievementService = require("../services/achievementService");

// Session de jeu en mémoire
let sessions = {};

// Fonction pour comparer les espèces
function compareEspeces(especes1, especes2) {
  const set1 = new Set(especes1);
  const set2 = new Set(especes2);

  if (JSON.stringify([...set1].sort()) === JSON.stringify([...set2].sort())) {
    return "correct";
  }

  const intersection = [...set1].filter((e) => set2.has(e));
  if (intersection.length > 0) {
    return "partial";
  }

  return "incorrect";
}

module.exports = () => {
  // GET /jeu - Nouvelle partie (PROTÉGÉ)
  router.get("/", authenticateToken, async (req, res) => {
    try {
      const sessionId = Date.now().toString();
      const totalBoss = await Boss.countDocuments();
      const randomIndex = Math.floor(Math.random() * totalBoss);
      const bossAleatoire = await Boss.findOne().skip(randomIndex);

      sessions[sessionId] = {
        bossSecret: bossAleatoire.nom,
        propositions: [],
        dateDebut: new Date().toISOString(),
        joueurId: req.joueur._id, // Stocker l'ID du joueur connecté
      };

      res.json({
        sessionId,
        bossSecret: sessions[sessionId].bossSecret,
        message: "Partie commencée ! Devinez le boss.",
        nbBoss: totalBoss,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /jeu/guess - Soumettre une proposition (PROTÉGÉ)
  router.post("/guess", authenticateToken, async (req, res) => {
    try {
      const { sessionId, proposition } = req.body;

      if (!sessions[sessionId]) {
        return res.status(400).json({ error: "Session invalide" });
      }

      const session = sessions[sessionId];
      const bossPropose = await Boss.findOne({ nom: proposition });
      const bossSecret = await Boss.findOne({ nom: session.bossSecret });

      if (!bossPropose) {
        return res.status(400).json({ error: "Boss inconnu" });
      }

      const correct = proposition === session.bossSecret;

      // Comparer les propriétés
      const indices = {
        jeu: bossPropose.jeu === bossSecret.jeu ? "correct" : "incorrect",
        genre: bossPropose.genre === bossSecret.genre ? "correct" : "incorrect",
        espece: compareEspeces(bossPropose.espece, bossSecret.espece),
        phases:
          bossPropose.phases === bossSecret.phases ? "correct" : "incorrect",
        nombre:
          bossPropose.nombre === bossSecret.nombre ? "correct" : "incorrect",
        cutscene:
          bossPropose.cutscene === bossSecret.cutscene
            ? "correct"
            : "incorrect",
        optionnel:
          bossPropose.optionnel === bossSecret.optionnel
            ? "correct"
            : "incorrect",
        dlc: bossPropose.dlc === bossSecret.dlc ? "correct" : "incorrect",
      };

      session.propositions.push({ proposition, indices, correct });

      // Si le joueur a trouvé le boss, créer la partie en BDD et gérer les streaks
      if (correct) {
        try {
          // Créer la partie en base de données
          const nouvellePartie = await Partie.create({
            id: sessionId,
            dateDebut: new Date(session.dateDebut),
            dateFin: new Date(),
            bossSecret: session.bossSecret,
            tentatives: session.propositions.length,
            joueurId: session.joueurId,
          });

          // Mettre à jour les statistiques du joueur et gérer les streaks
          const joueur = await Joueur.findById(session.joueurId);
          if (joueur) {
            // Incrémenter les parties gagnées
            joueur.partiesGagnees += 1;

            // Récupérer la dernière partie du joueur (avant celle-ci) pour calculer la streak
            const dernierePartie = await Partie.findOne({
              joueurId: session.joueurId,
              dateFin: { $lt: nouvellePartie.dateFin },
            })
              .sort({ dateFin: -1 })
              .limit(1);

            // Gestion des streaks
            const aujourdhui = new Date().toISOString().split("T")[0];

            if (!dernierePartie) {
              // Première partie terminée
              joueur.streakActuelle = 1;
              joueur.meilleureStreak = 1;
            } else {
              const dernierJour = new Date(dernierePartie.dateFin)
                .toISOString()
                .split("T")[0];

              if (dernierJour !== aujourdhui) {
                // Pas le même jour, vérifier si c'est consécutif
                const dernierJourDate = new Date(dernierJour);
                const aujourdhuiDate = new Date(aujourdhui);
                const diffJours = Math.floor(
                  (aujourdhuiDate - dernierJourDate) / (1000 * 60 * 60 * 24),
                );

                if (diffJours === 1) {
                  // Jour consécutif
                  joueur.streakActuelle += 1;
                  if (joueur.streakActuelle > joueur.meilleureStreak) {
                    joueur.meilleureStreak = joueur.streakActuelle;
                  }
                } else if (diffJours >= 2) {
                  // Streak brisée (2 jours ou plus)
                  joueur.streakActuelle = 1;
                }
                // Si diffJours === 0 (même jour), on ne change rien
              }
              // Si c'est le même jour, on ne touche pas aux streaks
            }

            await joueur.save();

            // Vérifier et débloquer les achievements
            const newAchievements =
              await achievementService.checkAndUnlockAchievements(
                session.joueurId,
              );

            // Ajouter les nouveaux achievements à la réponse
            if (newAchievements.length > 0) {
              res.json({
                proposition,
                correct,
                indices,
                tentatives: session.propositions.length,
                message: `Bravo ! C'était bien ${session.bossSecret} !`,
                newAchievements: newAchievements.map((a) => ({
                  id: a.id,
                  nom: a.nom,
                  description: a.description,
                  icone: a.icone,
                  rarete: a.rarete,
                })),
              });
              return;
            }
          }

          // Supprimer la session en mémoire
          delete sessions[sessionId];
        } catch (dbError) {
          console.error("Erreur lors de la sauvegarde de la partie:", dbError);
          // On supprime quand même la session pour ne pas bloquer le joueur
          delete sessions[sessionId];
        }
      }

      res.json({
        proposition,
        correct,
        indices,
        tentatives: session.propositions.length,
        message: correct
          ? `Bravo ! C'était bien ${session.bossSecret} !`
          : "Essayez encore !",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
