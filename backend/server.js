const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");
const connectDB = require("./config/database");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Fonction async pour démarrer le serveur
const startServer = async () => {
  try {
    // Connexion à MongoDB
    await connectDB();

    // Routes
    const authRoutes = require("./routes/auth");
    const bossRoutes = require("./routes/boss");
    const soulsRoutes = require("./routes/souls");
    const joueursRoutes = require("./routes/joueurs");
    const partiesRoutes = require("./routes/parties");
    const jeuRoutes = require("./routes/jeu");
    const statsRoutes = require("./routes/stats");

    app.use("/auth", authRoutes());
    app.use("/boss", bossRoutes());
    app.use("/souls", soulsRoutes());
    app.use("/joueurs", joueursRoutes());
    app.use("/parties", partiesRoutes());
    app.use("/jeu", jeuRoutes());
    app.use("/stats", statsRoutes());

    // Swagger Documentation
    const swaggerDocument = YAML.load(
      path.join(__dirname, "..", "soulsdle-api-spec.yaml"),
    );
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // Route racine
    app.get("/", (req, res) => {
      res.json({
        nom: "API Soulsdle",
        description:
          "Jeu de devinettes sur les boss FromSoftware (Bloodborne, Sekiro, Dark Souls III)",
        version: "1.0.0",
        endpoints: {
          auth: "/auth",
          boss: "/boss",
          souls: "/souls",
          joueurs: "/joueurs",
          parties: "/parties",
          jeu: "/jeu",
          stats: "/stats",
        },
        documentation: "/api-docs",
      });
    });

    // Gestion des erreurs 404
    app.use((req, res) => {
      res.status(404).json({
        erreur: "Route non trouvée",
        message: `La route ${req.method} ${req.url} n'existe pas`,
        documentation: "/api-docs",
      });
    });

    // Gestion globale des erreurs
    app.use((err, req, res, next) => {
      console.error("❌ Erreur:", err);
      res.status(err.status || 500).json({
        erreur: err.message || "Erreur interne du serveur",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
      });
    });

    // Démarrage du serveur
    app.listen(PORT, () => {
      console.log(`🎮 Soulsdle API démarrée sur http://localhost:${PORT}`);
      console.log(
        `📚 Documentation Swagger: http://localhost:${PORT}/api-docs`,
      );
    });
  } catch (error) {
    console.error("❌ Erreur au démarrage du serveur:", error);
    process.exit(1);
  }
};

// Démarrer le serveur
startServer();

module.exports = app;
