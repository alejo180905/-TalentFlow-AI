/**
 * Recommendation Controller - Motor de recomendación con Neo4j
 */

const { query } = require('../utils/database');
const { getRecommendedVacancies, runQuery } = require('../utils/neo4j');

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

            // Ajustar score con expectativas
            if (expectations) {
                recommendations = recommendations.map(vacancy => {
                    let finalScore = vacancy.skillScore || 50;
                    let scoreBreakdown = {
                        skills: vacancy.skillScore || 50,
                        salary: 0,
                        location: 0,
                        modality: 0
                    };

                    // Score por salario (25%)
                    if (expectations.min_salary && vacancy.maxSalary) {
                        if (vacancy.maxSalary >= expectations.min_salary) {
                            scoreBreakdown.salary = 100;
                        } else {
                            const ratio = vacancy.maxSalary / expectations.min_salary;
                            scoreBreakdown.salary = Math.round(ratio * 100);
                        }
                    } else {
                        scoreBreakdown.salary = 50;
                    }

                    // Score por modalidad (15%)
                    if (expectations.work_modality && vacancy.workModality) {
                        scoreBreakdown.modality =
                            expectations.work_modality === vacancy.workModality ? 100 : 30;
                    } else {
                        scoreBreakdown.modality = 50;
                    }

                    // Score por ubicación (10%)
                    if (expectations.preferred_locations && vacancy.location) {
                        const isPreferred = expectations.preferred_locations.some(
                            loc => vacancy.location.toLowerCase().includes(loc.toLowerCase())
                        );
                        scoreBreakdown.location = isPreferred ? 100 : 30;
                    } else {
                        scoreBreakdown.location = 50;
                    }

                    // Calcular score final ponderado
                    finalScore = Math.round(
                        scoreBreakdown.skills * 0.50 +
                        scoreBreakdown.salary * 0.25 +
                        scoreBreakdown.modality * 0.15 +
                        scoreBreakdown.location * 0.10
                    );

                    return {
                        ...vacancy,
                        compatibilityScore: finalScore,
                        scoreBreakdown
                    };
                });

                // Ordenar por score final
                recommendations.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
            }

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

            // Obtener skills del usuario
            const userSkills = await runQuery(`
                MATCH (c:Candidate {userId: $userId})-[:HAS_SKILL]->(s:Skill)
                RETURN COLLECT(s.name) AS skills
            `, { userId: req.user.userId });

            const candidateSkills = userSkills[0]?.get('skills') || [];

            // Obtener skills requeridas por la vacante
            const vacancySkills = await runQuery(`
                MATCH (v:Vacancy {externalId: $vacancyId})-[:REQUIRES_SKILL]->(s:Skill)
                RETURN COLLECT(s.name) AS skills
            `, { vacancyId });

            const requiredSkills = vacancySkills[0]?.get('skills') || [];

            // Calcular coincidencias
            const matchedSkills = candidateSkills.filter(s => requiredSkills.includes(s));
            const missingSkills = requiredSkills.filter(s => !candidateSkills.includes(s));

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

            const exp = expectations.rows[0];
            const vac = vacancy.rows[0];

            const breakdown = {
                skills: {
                    score: requiredSkills.length > 0
                        ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
                        : 50,
                    weight: '50%',
                    matched: matchedSkills,
                    missing: missingSkills,
                    total: requiredSkills.length
                },
                salary: {
                    score: 50,
                    weight: '25%',
                    expected: exp?.min_salary,
                    offered: vac?.max_salary,
                    meets: vac?.max_salary >= (exp?.min_salary || 0)
                },
                modality: {
                    score: 50,
                    weight: '15%',
                    expected: exp?.work_modality,
                    offered: vac?.work_modality,
                    meets: exp?.work_modality === vac?.work_modality
                },
                location: {
                    score: 50,
                    weight: '10%',
                    preferred: exp?.preferred_locations,
                    offered: vac?.location
                }
            };

            // Calcular scores
            if (exp?.min_salary && vac?.max_salary) {
                breakdown.salary.score = vac.max_salary >= exp.min_salary ? 100 :
                    Math.round((vac.max_salary / exp.min_salary) * 100);
            }

            if (exp?.work_modality && vac?.work_modality) {
                breakdown.modality.score = exp.work_modality === vac.work_modality ? 100 : 30;
            }

            if (exp?.preferred_locations && vac?.location) {
                const isMatch = exp.preferred_locations.some(
                    loc => vac.location.toLowerCase().includes(loc.toLowerCase())
                );
                breakdown.location.score = isMatch ? 100 : 30;
            }

            const finalScore = Math.round(
                breakdown.skills.score * 0.50 +
                breakdown.salary.score * 0.25 +
                breakdown.modality.score * 0.15 +
                breakdown.location.score * 0.10
            );

            res.json({
                success: true,
                data: {
                    vacancyId,
                    finalScore,
                    breakdown
                }
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = recommendationController;
