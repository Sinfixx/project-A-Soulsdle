const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");
const Joueur = require("../models/Joueur");

/**
 * Middleware pour vérifier le token JWT
 */
const authenticateToken = async (req, res, next) => {
  try {
    // Récupérer le token du header Authorization
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({ error: "Token manquant" });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, jwtConfig.secret);

    // Récupérer le joueur (sans le password)
    const joueur = await Joueur.findById(decoded.id).select("-password");

    if (!joueur) {
      return res.status(401).json({ error: "Joueur non trouvé" });
    }

    // Ajouter le joueur à la requête
    req.joueur = joueur;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ error: "Token invalide" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ error: "Token expiré" });
    }
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Middleware optionnel - récupère le joueur si token présent, sinon continue
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      const decoded = jwt.verify(token, jwtConfig.secret);
      const joueur = await Joueur.findById(decoded.id).select("-password");
      if (joueur) {
        req.joueur = joueur;
      }
    }
    next();
  } catch (error) {
    // En cas d'erreur, on continue sans joueur authentifié
    next();
  }
};

module.exports = { authenticateToken, optionalAuth };
