/**
 * Recommendation Controller - Motor de recomendación con Neo4j
 */

const { query } = require('../utils/database');
const { getRecommendedVacancies, runQuery } = require('../utils/neo4j');
const { scoreJob } = require('../services/recommendationService');

async function getCandidateSkills(userId) {
    try {
        const userSkills = await runQuery(`
            MATCH (c:Candidate {userId: $userId})-[:HAS_SKILL]->(s:Skill)
            RETURN COLLECT(s.name) AS skills
        `, { userId });

        return userSkills[0]?.get('skills') || [];
    } catch (error) {
        console.error('Error obteniendo skills del candidato:', error);
        return [];
    }
}

function buildProfile(expectations, user, candidateSkills) {
    return {
        skills: candidateSkills,
        minSalary: expectations?.min_salary,
        maxSalary: expectations?.max_salary,
        modality: expectations?.work_modality,
        preferredLocations: expectations?.preferred_locations || (user?.location ? [user.location] : []),
        willingToRelocate: expectations?.willing_to_relocate || false
    };
}

function normalizeVacancy(vacancy) {
    return {
        ...vacancy,
        minSalary: vacancy.minSalary ?? vacancy.min_salary,
        maxSalary: vacancy.maxSalary ?? vacancy.max_salary,
        workModality: vacancy.workModality ?? vacancy.work_modality,
        skills: vacancy.skills || vacancy.required_skills || [],
        experienceYears: vacancy.experienceYears ?? vacancy.experience_years
    };
}

const recommendationController = {
    /**
     * Obtener vacantes recomendadas
     */
    async getRecommendations(req, res, next) {
        try {
            const { limit = 20 } = req.query;

            // Obtener expectativas del usuario
            const expectationsResult = await query(
                'SELECT * FROM user_expectations WHERE user_id = $1',
                [req.user.userId]
            );
            const expectations = expectationsResult.rows[0];
            const userResult = await query(
                'SELECT location FROM users WHERE id = $1',
                [req.user.userId]
            );
            const user = userResult.rows[0] || null;
            const candidateSkills = await getCandidateSkills(req.user.userId);
            const profile = buildProfile(expectations, user, candidateSkills);

            // Obtener recomendaciones de Neo4j basadas en skills
            let recommendations = [];
            try {
                const records = await getRecommendedVacancies(req.user.userId, parseInt(limit));
                recommendations = records.map(record => record.get('vacancy'));
            } catch (neo4jError) {
                console.error('Error obteniendo recomendaciones de Neo4j:', neo4jError);
                // Fallback: obtener de PostgreSQL
                const fallback = await query(`
                    SELECT * FROM vacancies WHERE is_active = true
                    ORDER BY created_at DESC LIMIT $1
                `, [parseInt(limit)]);
                recommendations = fallback.rows.map(v => ({
                    ...v,
                    skillScore: 50 // Score por defecto
                }));
            }

            recommendations = recommendations
                .map((vacancy) => {
                    const normalizedVacancy = normalizeVacancy(vacancy);
                    const result = scoreJob(profile, normalizedVacancy);

                    return {
                        ...vacancy,
                        compatibilityScore: result.score,
                        scoreBreakdown: result.rawScores,
                        reasons: result.reasons
                    };
                })
                .sort((a, b) => b.compatibilityScore - a.compatibilityScore);

            res.json({
                success: true,
                data: {
                    recommendations,
                    count: recommendations.length,
                    hasExpectations: !!expectations
                }
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Obtener desglose del score de compatibilidad
     */
    async getScoreBreakdown(req, res, next) {
        try {
            const { vacancyId } = req.params;

            const candidateSkills = await getCandidateSkills(req.user.userId);

            // Obtener expectativas
            const expectations = await query(
                'SELECT * FROM user_expectations WHERE user_id = $1',
                [req.user.userId]
            );

            // Obtener vacante
            const vacancy = await query(
                'SELECT * FROM vacancies WHERE id = $1',
                [vacancyId]
            );

            const userResult = await query(
                'SELECT location FROM users WHERE id = $1',
                [req.user.userId]
            );

            const exp = expectations.rows[0];
            const vac = vacancy.rows[0];
            const user = userResult.rows[0] || null;

            if (!vac) {
                return res.status(404).json({
                    success: false,
                    message: 'Vacante no encontrada'
                });
            }

            const profile = buildProfile(exp, user, candidateSkills);
            const result = scoreJob(profile, normalizeVacancy(vac));
            const requiredSkills = vac.required_skills || [];
            const matchedSkills = result.matchedSkills;
            const missingSkills = requiredSkills.filter(skill => !matchedSkills.includes(skill));

            const breakdown = {
                skills: {
                    score: result.rawScores.skills,
                    weight: '40%',
                    matched: matchedSkills,
                    missing: missingSkills,
                    total: requiredSkills.length
                },
                salary: {
                    score: result.rawScores.salary,
                    weight: '24%',
                    expected: exp?.min_salary,
                    offered: vac?.max_salary,
                    meets: vac?.max_salary >= (exp?.min_salary || 0)
                },
                location: {
                    score: result.rawScores.location,
                    weight: '18%',
                    preferred: exp?.preferred_locations,
                    offered: vac?.location,
                    modality: vac?.work_modality
                },
                experience: {
                    score: result.rawScores.experience,
                    weight: '17%',
                    candidate: null,
                    required: vac?.experience_years,
                    meets: false
                }
            };

            res.json({
                success: true,
                data: {
                    vacancyId,
                    finalScore: result.score,
                    breakdown
                }
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = recommendationController;
