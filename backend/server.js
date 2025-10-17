const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const yaml = require("js-yaml");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Charger les données JSON
const dataPath = path.join(__dirname, "..", "Soulsdle.json");
let data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

// Fonction pour sauvegarder les données
const saveData = () => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// Charger la spec OpenAPI pour Swagger
const swaggerPath = path.join(__dirname, "..", "soulsdle-api-spec.yaml");
const swaggerDocument = yaml.load(fs.readFileSync(swaggerPath, "utf8"));

// Documentation Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Importer les routes
const bossRoutes = require("./routes/boss");
const soulsRoutes = require("./routes/souls");
const joueursRoutes = require("./routes/joueurs");
const partiesRoutes = require("./routes/parties");
const jeuRoutes = require("./routes/jeu");
const statsRoutes = require("./routes/stats");

// ==================== ROUTES ====================

// Route racine - Infos API
app.get("/", (req, res) => {
  res.json({
    nom: "Soulsdle API",
    description: "API pour le jeu de devinettes Soulsdle",
    version: "1.0.0",
    totalBoss: data.boss.length,
    documentation: `http://localhost:${PORT}/api-docs`,
  });
});

// Monter les routes
app.use("/boss", bossRoutes(data, saveData));
app.use("/souls", soulsRoutes(data, saveData));
app.use("/joueurs", joueursRoutes(data, saveData));
app.use("/parties", partiesRoutes(data, saveData));
app.use("/jeu", jeuRoutes(data));
app.use("/stats", statsRoutes(data));

// ==================== DÉMARRAGE ====================

app.listen(PORT, () => {
  console.log(`🎮 Soulsdle API démarrée sur http://localhost:${PORT}`);
  console.log(`📚 Documentation Swagger: http://localhost:${PORT}/api-docs`);
  console.log(`📊 ${data.boss.length} boss chargés`);
});
