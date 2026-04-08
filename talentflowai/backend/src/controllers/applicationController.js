const store = require("../models/store");

const ALLOWED_STATUS = ["Postulado", "En revisión", "Entrevista", "Descartado"];

function createApplication(req, res) {
  const { jobId, source = "manual" } = req.body;

  const job = store.jobs.find((entry) => entry.id === Number(jobId));
  if (!job) {
    return res.status(404).json({ message: "Vacante no encontrada" });
  }

  const exists = store.applications.find(
    (entry) => entry.userId === req.user.userId && entry.jobId === Number(jobId)
  );

  if (exists) {
    return res.status(409).json({ message: "Ya existe una postulación para esta vacante" });
  }

  const application = {
    id: store.ids.application++,
    userId: req.user.userId,
    jobId: Number(jobId),
    status: "Postulado",
    source,
    createdAt: new Date().toISOString()
  };

  store.applications.push(application);
  return res.status(201).json(application);
}

function listApplications(req, res) {
  const applications = store.applications
    .filter((entry) => entry.userId === req.user.userId)
    .map((entry) => {
      const job = store.jobs.find((jobItem) => jobItem.id === entry.jobId);
      return {
        ...entry,
        job
      };
    });

  return res.json(applications);
}

function updateApplicationStatus(req, res) {
  const { status } = req.body;
  const applicationId = Number(req.params.id);

  if (!ALLOWED_STATUS.includes(status)) {
    return res.status(400).json({ message: "Estado inválido" });
  }

  const application = store.applications.find(
    (entry) => entry.id === applicationId && entry.userId === req.user.userId
  );

  if (!application) {
    return res.status(404).json({ message: "Postulación no encontrada" });
  }

  application.status = status;
  return res.json(application);
}

module.exports = {
  createApplication,
  listApplications,
  updateApplicationStatus
};
