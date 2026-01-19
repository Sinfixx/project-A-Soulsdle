const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Supprimer les options dépréciées
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
    console.log(`📊 Base de données: ${conn.connection.name}`);
  } catch (error) {
    console.error("❌ Erreur de connexion MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
