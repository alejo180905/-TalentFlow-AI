const store = require("../models/store");
const { buildRecommendations } = require("../services/recommendationService");

function runAutoApply(req, res) {
  const { limit = 2, minScore = 55 } = req.body || {};

  const profile = store.profiles[req.user.userId];
  if (!profile) {
    return res.status(404).json({ message: "Perfil no encontrado" });
  }

  const recommendations = buildRecommendations(profile, store.jobs)
    .filter((job) => job.score >= Number(minScore))
    .slice(0, Number(limit));

  const created = [];

  for (const job of recommendations) {
    const alreadyApplied = store.applications.find(
      (entry) => entry.userId === req.user.userId && entry.jobId === job.id
    );

    if (alreadyApplied) {
      continue;
    }

    const application = {
      id: store.ids.application++,
      userId: req.user.userId,
      jobId: job.id,
      status: "Postulado",
      source: "auto",
      createdAt: new Date().toISOString()
    };

    store.applications.push(application);
    created.push(application);
  }

  return res.json({
    totalGenerated: created.length,
    applications: created
  });
}

module.exports = {
  runAutoApply
};
