/**
 * TalentFlow AI - Recommendation Service
 * Motor de recomendación con scoring ponderado
 *
 * PESOS DEL ALGORITMO:
 * - Skills:      40% - Match de habilidades técnicas
 * - Salary:      24% - Alineación salarial
 * - Location:    18% - Ubicación/Modalidad de trabajo
 * - Experience:  17% - Años de experiencia requeridos
 *
 * Nota: los pesos solicitados suman 99%. Se normaliza sobre ese total
 * para mantener el score final en escala 0-100.
 */

// Constantes de pesos (fuente única de verdad)
const WEIGHTS = {
  skills: 0.40,      // 40%
  salary: 0.24,      // 24%
  location: 0.18,    // 18%
  experience: 0.17   // 17%
};

const TOTAL_WEIGHT = Object.values(WEIGHTS).reduce((sum, value) => sum + value, 0);

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function firstDefinedNumber(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== "") {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    }
  }
  return 0;
}

function hasValue(value) {
  return value !== undefined && value !== null && value !== "";
}

function scoreJob(profile, job) {
  const profileSkills = (profile.skills || []).map(normalizeText).filter(Boolean);
  const jobSkills = (job.skills || job.required_skills || []).map(normalizeText).filter(Boolean);

  // 1. SKILLS MATCH (40%)
  const matchedSkills = jobSkills.filter((skill) => profileSkills.includes(skill));
  const skillsRatio = jobSkills.length ? matchedSkills.length / jobSkills.length : 0;
  const skillsScore = skillsRatio * WEIGHTS.skills * 100;

  // 2. SALARY MATCH (24%)
  const expectedMin = firstDefinedNumber(profile.expectedSalary, profile.minSalary, profile.min_salary);
  const expectedMax = firstDefinedNumber(profile.maxSalary, profile.max_salary, expectedMin > 0 ? expectedMin * 1.5 : 0);
  const jobMin = firstDefinedNumber(job.salary, job.minSalary, job.min_salary);
  const jobMax = firstDefinedNumber(job.maxSalary, job.max_salary, jobMin);

  let salaryScore = 0;
  let salaryRawScore = 0;
  if (expectedMin > 0 && jobMax > 0) {
    // Score completo si hay solapamiento de rangos
    if (jobMax >= expectedMin && jobMin <= expectedMax) {
      salaryScore = WEIGHTS.salary * 100;
      salaryRawScore = 100;
    } else if (jobMax >= expectedMin * 0.8) {
      // Score parcial si está cerca (80% del mínimo esperado)
      salaryScore = WEIGHTS.salary * 50;
      salaryRawScore = 50;
    }
  } else {
    // Si no hay datos de salario, dar score neutro
    salaryScore = WEIGHTS.salary * 50;
    salaryRawScore = 50;
  }

  // 3. LOCATION/MODALITY MATCH (18%)
  const preferredLocations = Array.isArray(profile.preferredLocations)
    ? profile.preferredLocations.map(normalizeText).filter(Boolean)
    : [normalizeText(profile.location)].filter(Boolean);
  const jobLocation = normalizeText(job.location);
  const profileModality = normalizeText(profile.modality || profile.workModality || profile.work_modality);
  const jobModality = normalizeText(job.modality || job.workModality || job.work_modality);
  const modalityMatch = !profileModality || !jobModality ? false : profileModality === jobModality;
  const locationMatch = preferredLocations.some(
    (location) => jobLocation.includes(location) || location.includes(jobLocation)
  );
  const willingToRelocate = profile.willingToRelocate || profile.willing_to_relocate || false;

  let locationScore = 0;
  let locationRawScore = 0;
  if (modalityMatch && locationMatch) {
    locationScore = WEIGHTS.location * 100;
    locationRawScore = 100;
  } else if (modalityMatch && (willingToRelocate || normalizeText(job.modality) === 'remote')) {
    locationScore = WEIGHTS.location * 75;
    locationRawScore = 75;
  } else if (locationMatch || modalityMatch) {
    locationScore = WEIGHTS.location * 50;
    locationRawScore = 50;
  } else if (!preferredLocations.length && !profileModality) {
    locationScore = WEIGHTS.location * 50;
    locationRawScore = 50;
  }

  // 4. EXPERIENCE MATCH (17%)
  const hasProfileExperience = hasValue(profile.experienceYears) || hasValue(profile.experience) || hasValue(profile.experience_years);
  const profileYears = firstDefinedNumber(profile.experienceYears, profile.experience, profile.experience_years);
  const requiredYears = firstDefinedNumber(job.experienceYears, job.experience, job.experience_years);

  let experienceScore = 0;
  let experienceRawScore = 0;
  if (requiredYears === 0) {
    // Sin requisito de experiencia = score completo
    experienceScore = WEIGHTS.experience * 100;
    experienceRawScore = 100;
  } else if (!hasProfileExperience) {
    // Si no hay dato de experiencia del candidato, mantener score neutro
    experienceScore = WEIGHTS.experience * 50;
    experienceRawScore = 50;
  } else if (profileYears >= requiredYears) {
    // Cumple o excede = score completo
    experienceScore = WEIGHTS.experience * 100;
    experienceRawScore = 100;
  } else if (profileYears >= requiredYears * 0.7) {
    // Tiene al menos 70% de la experiencia requerida
    experienceScore = WEIGHTS.experience * 70;
    experienceRawScore = 70;
  } else if (profileYears > 0) {
    // Tiene algo de experiencia
    experienceScore = (profileYears / requiredYears) * WEIGHTS.experience * 100;
    experienceRawScore = Math.round((profileYears / requiredYears) * 100);
  }

  // TOTAL
  const totalScore = Math.round((skillsScore + salaryScore + locationScore + experienceScore) / TOTAL_WEIGHT);
  const rawScores = {
    skills: Math.round(skillsRatio * 100),
    salary: salaryRawScore,
    location: locationRawScore,
    experience: experienceRawScore
  };

  return {
    score: Math.min(totalScore, 100), // Cap at 100
    matchedSkills,
    rawScores,
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
      rawScores.salary >= 75 ? "Salario alineado" : "Salario por debajo de expectativa",
      rawScores.location >= 75 ? "Ubicación/modalidad compatible" : "Ubicación o modalidad distinta",
      rawScores.experience >= 75 ? "Experiencia suficiente" : "Experiencia menor a la requerida"
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
