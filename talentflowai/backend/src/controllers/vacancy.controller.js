/**
 * Vacancy Controller
 */

const { query } = require('../utils/database');

const vacancyController = {
    /**
     * Obtener todas las vacantes
     */
    async getAll(req, res, next) {
        try {
            const { page = 1, limit = 20, modality, location, minSalary } = req.query;
            const offset = (page - 1) * limit;

            let queryText = `
                SELECT * FROM vacancies
                WHERE is_active = true
            `;
            const params = [];
            let paramCount = 1;

            if (modality) {
                queryText += ` AND work_modality = $${paramCount}`;
                params.push(modality);
                paramCount++;
            }

            if (location) {
                queryText += ` AND location ILIKE $${paramCount}`;
                params.push(`%${location}%`);
                paramCount++;
            }

            if (minSalary) {
                queryText += ` AND max_salary >= $${paramCount}`;
                params.push(parseInt(minSalary));
                paramCount++;
            }

            queryText += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
            params.push(parseInt(limit), parseInt(offset));

            const result = await query(queryText, params);

            // Obtener total para paginación
            const countResult = await query(
                'SELECT COUNT(*) FROM vacancies WHERE is_active = true'
            );

            res.json({
                success: true,
                data: {
                    vacancies: result.rows,
                    pagination: {
                        page: parseInt(page),
                        limit: parseInt(limit),
                        total: parseInt(countResult.rows[0].count),
                        pages: Math.ceil(countResult.rows[0].count / limit)
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Obtener vacante por ID
     */
    async getById(req, res, next) {
        try {
            const { id } = req.params;

            const result = await query(
                'SELECT * FROM vacancies WHERE id = $1',
                [id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Vacante no encontrada'
                });
            }

            res.json({
                success: true,
                data: { vacancy: result.rows[0] }
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Buscar vacantes
     */
    async search(req, res, next) {
        try {
            const { q, skills, modality, location, minSalary, maxSalary } = req.query;

            let queryText = `
                SELECT * FROM vacancies
                WHERE is_active = true
            `;
            const params = [];
            let paramCount = 1;

            // Búsqueda por texto
            if (q) {
                queryText += ` AND (title ILIKE $${paramCount} OR description ILIKE $${paramCount} OR company ILIKE $${paramCount})`;
                params.push(`%${q}%`);
                paramCount++;
            }

            // Filtrar por skills
            if (skills) {
                const skillsArray = skills.split(',').map(s => s.trim().toLowerCase());
                queryText += ` AND required_skills && $${paramCount}`;
                params.push(skillsArray);
                paramCount++;
            }

            // Filtros adicionales
            if (modality) {
                queryText += ` AND work_modality = $${paramCount}`;
                params.push(modality);
                paramCount++;
            }

            if (location) {
                queryText += ` AND location ILIKE $${paramCount}`;
                params.push(`%${location}%`);
                paramCount++;
            }

            if (minSalary) {
                queryText += ` AND max_salary >= $${paramCount}`;
                params.push(parseInt(minSalary));
                paramCount++;
            }

            if (maxSalary) {
                queryText += ` AND min_salary <= $${paramCount}`;
                params.push(parseInt(maxSalary));
                paramCount++;
            }

            queryText += ' ORDER BY created_at DESC LIMIT 50';

            const result = await query(queryText, params);

            res.json({
                success: true,
                data: {
                    vacancies: result.rows,
                    count: result.rows.length
                }
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = vacancyController;
