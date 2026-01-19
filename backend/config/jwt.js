module.exports = {
  secret: process.env.JWT_SECRET || "soulsdle_secret_key_change_in_production",
  expiresIn: "7d", // Token valide 7 jours
  refreshExpiresIn: "30d", // Refresh token valide 30 jours
};
