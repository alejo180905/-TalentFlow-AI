const store = require("../models/store");

function getProfile(req, res) {
  const profile = store.profiles[req.user.userId];
  if (!profile) {
    return res.status(404).json({ message: "Perfil no encontrado" });
  }

  return res.json(profile);
}

function updateProfile(req, res) {
  const currentProfile = store.profiles[req.user.userId];
  if (!currentProfile) {
    return res.status(404).json({ message: "Perfil no encontrado" });
  }

  const {
    skills = currentProfile.skills,
    yearsExperience = currentProfile.yearsExperience,
    expectedSalary = currentProfile.expectedSalary,
    location = currentProfile.location,
    modality = currentProfile.modality,
    summary = currentProfile.summary
  } = req.body;

  const parsedSkills = Array.isArray(skills)
    ? skills
    : String(skills)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

  const profile = {
    ...currentProfile,
    skills: parsedSkills,
    yearsExperience: Number(yearsExperience) || 0,
    expectedSalary: Number(expectedSalary) || 0,
    location,
    modality,
    summary
  };

  store.profiles[req.user.userId] = profile;

  return res.json(profile);
}

module.exports = {
  getProfile,
  updateProfile
};
