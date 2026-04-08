const store = require("../models/store");
const { buildRecommendations } = require("../services/recommendationService");

function listRecommendations(req, res) {
  const profile = store.profiles[req.user.userId];

  if (!profile) {
    return res.status(404).json({ message: "Perfil no encontrado" });
  }

  const recommendations = buildRecommendations(profile, store.jobs);
  return res.json(recommendations);
}

module.exports = {
  listRecommendations
};
