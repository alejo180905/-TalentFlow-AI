function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function scoreJob(profile, job) {
  const profileSkills = (profile.skills || []).map(normalizeText).filter(Boolean);
  const jobSkills = (job.skills || []).map(normalizeText).filter(Boolean);

  const matchedSkills = jobSkills.filter((skill) => profileSkills.includes(skill));
  const skillsScore = jobSkills.length ? (matchedSkills.length / jobSkills.length) * 60 : 0;

  const modalityMatch = normalizeText(profile.modality) === normalizeText(job.modality) ? 15 : 0;
  const locationMatch = normalizeText(profile.location) === normalizeText(job.location) ? 15 : 0;

  const expectedSalary = Number(profile.expectedSalary || 0);
  const salaryScore = expectedSalary > 0 && job.salary >= expectedSalary ? 10 : 0;

  const totalScore = Math.round(skillsScore + modalityMatch + locationMatch + salaryScore);

  return {
    score: totalScore,
    matchedSkills,
    reasons: [
      matchedSkills.length ? `Skills en común: ${matchedSkills.join(", ")}` : "Pocas skills en común",
      modalityMatch ? "Modalidad compatible" : "Modalidad distinta",
      locationMatch ? "Ubicación compatible" : "Ubicación distinta",
      salaryScore ? "Salario alineado" : "Salario por debajo de expectativa"
    ]
  };
}

function buildRecommendations(profile, jobs) {
  return jobs
    .map((job) => {
      const result = scoreJob(profile, job);
      return {
        ...job,
        score: result.score,
        matchedSkills: result.matchedSkills,
        reasons: result.reasons
      };
    })
    .sort((a, b) => b.score - a.score);
}

module.exports = {
  buildRecommendations
};
