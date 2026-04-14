/**
 * TalentFlow AI - Recommendation Service
 * Motor de recomendación con scoring ponderado
 *
 * PESOS DEL ALGORITMO (Total: 100%):
 * - Skills:      40% - Match de habilidades técnicas
 * - Salary:      25% - Alineación salarial
 * - Location:    20% - Ubicación/Modalidad de trabajo
 * - Experience:  15% - Años de experiencia requeridos
 */

// Constantes de pesos (fuente única de verdad)
const WEIGHTS = {
  skills: 0.40,      // 40%
  salary: 0.25,      // 25%
  location: 0.20,    // 20%
  experience: 0.15   // 15%
};

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function scoreJob(profile, job) {
  const profileSkills = (profile.skills || []).map(normalizeText).filter(Boolean);
  const jobSkills = (job.skills || []).map(normalizeText).filter(Boolean);

  // 1. SKILLS MATCH (40%)
  const matchedSkills = jobSkills.filter((skill) => profileSkills.includes(skill));
  const skillsRatio = jobSkills.length ? matchedSkills.length / jobSkills.length : 0;
  const skillsScore = skillsRatio * WEIGHTS.skills * 100;

  // 2. SALARY MATCH (25%)
  const expectedMin = Number(profile.expectedSalary || profile.minSalary || 0);
  const expectedMax = Number(profile.maxSalary || expectedMin * 1.5 || 0);
  const jobMin = Number(job.salary || job.minSalary || 0);
  const jobMax = Number(job.maxSalary || jobMin || 0);

  let salaryScore = 0;
  if (expectedMin > 0 && jobMax > 0) {
    // Score completo si hay solapamiento de rangos
    if (jobMax >= expectedMin && jobMin <= expectedMax) {
      salaryScore = WEIGHTS.salary * 100;
    } else if (jobMax >= expectedMin * 0.8) {
      // Score parcial si está cerca (80% del mínimo esperado)
      salaryScore = WEIGHTS.salary * 50;
    }
  } else {
    // Si no hay datos de salario, dar score neutro
    salaryScore = WEIGHTS.salary * 50;
  }

  // 3. LOCATION/MODALITY MATCH (20%)
  const modalityMatch = normalizeText(profile.modality) === normalizeText(job.modality);
  const locationMatch = normalizeText(profile.location) === normalizeText(job.location);
  const willingToRelocate = profile.willingToRelocate || false;

  let locationScore = 0;
  if (modalityMatch && locationMatch) {
    locationScore = WEIGHTS.location * 100;
  } else if (modalityMatch && (willingToRelocate || normalizeText(job.modality) === 'remote')) {
    locationScore = WEIGHTS.location * 75;
  } else if (modalityMatch) {
    locationScore = WEIGHTS.location * 50;
  }

  // 4. EXPERIENCE MATCH (15%)
  const profileYears = Number(profile.experienceYears || profile.experience || 0);
  const requiredYears = Number(job.experienceYears || job.experience || 0);

  let experienceScore = 0;
  if (requiredYears === 0) {
    // Sin requisito de experiencia = score completo
    experienceScore = WEIGHTS.experience * 100;
  } else if (profileYears >= requiredYears) {
    // Cumple o excede = score completo
    experienceScore = WEIGHTS.experience * 100;
  } else if (profileYears >= requiredYears * 0.7) {
    // Tiene al menos 70% de la experiencia requerida
    experienceScore = WEIGHTS.experience * 70;
  } else if (profileYears > 0) {
    // Tiene algo de experiencia
    experienceScore = (profileYears / requiredYears) * WEIGHTS.experience * 100;
  }

  // TOTAL
  const totalScore = Math.round(skillsScore + salaryScore + locationScore + experienceScore);

  return {
    score: Math.min(totalScore, 100), // Cap at 100
    matchedSkills,
    breakdown: {
      skills: Math.round(skillsScore),
      salary: Math.round(salaryScore),
      location: Math.round(locationScore),
      experience: Math.round(experienceScore)
    },
    reasons: [
      matchedSkills.length
        ? `Skills en común: ${matchedSkills.join(", ")} (${Math.round(skillsRatio * 100)}%)`
        : "Pocas skills en común",
      salaryScore >= WEIGHTS.salary * 75 ? "Salario alineado" : "Salario por debajo de expectativa",
      locationScore >= WEIGHTS.location * 75 ? "Ubicación/modalidad compatible" : "Ubicación o modalidad distinta",
      experienceScore >= WEIGHTS.experience * 75 ? "Experiencia suficiente" : "Experiencia menor a la requerida"
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
        breakdown: result.breakdown,
        reasons: result.reasons
      };
    })
    .sort((a, b) => b.score - a.score);
}

/**
 * Obtener el breakdown del score para una vacante específica
 */
function getScoreBreakdown(profile, job) {
  return scoreJob(profile, job);
}

module.exports = {
  WEIGHTS,
  scoreJob,
  buildRecommendations,
  getScoreBreakdown
};
