const express = require("express");
const router = express.Router();

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

module.exports = (data) => {
  // GET /jeu - Nouvelle partie
  router.get("/", (req, res) => {
    const sessionId = Date.now().toString();
    const bossAleatoire =
      data.boss[Math.floor(Math.random() * data.boss.length)];

    sessions[sessionId] = {
      bossSecret: bossAleatoire.nom,
      propositions: [],
      dateDebut: new Date().toISOString(),
    };

    res.json({
      sessionId,
      bossSecret: sessions[sessionId].bossSecret,
      message: "Partie commencée ! Devinez le boss.",
      nbBoss: data.boss.length,
    });
  });

  // POST /jeu/guess - Soumettre une proposition
  router.post("/guess", (req, res) => {
    const { sessionId, proposition } = req.body;

    if (!sessions[sessionId]) {
      return res.status(400).json({ error: "Session invalide" });
    }

    const session = sessions[sessionId];
    const bossPropose = data.boss.find((b) => b.nom === proposition);
    const bossSecret = data.boss.find((b) => b.nom === session.bossSecret);

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
        bossPropose.cutscene === bossSecret.cutscene ? "correct" : "incorrect",
      optionnel:
        bossPropose.optionnel === bossSecret.optionnel
          ? "correct"
          : "incorrect",
      dlc: bossPropose.dlc === bossSecret.dlc ? "correct" : "incorrect",
    };

    session.propositions.push({ proposition, indices, correct });

    res.json({
      proposition,
      correct,
      indices,
      tentatives: session.propositions.length,
      message: correct
        ? `Bravo ! C'était bien ${session.bossSecret} !`
        : "Essayez encore !",
    });

    if (correct) {
      delete sessions[sessionId];
    }
  });

  return router;
};
