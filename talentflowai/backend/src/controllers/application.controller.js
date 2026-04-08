/**
 * Application Controller - Postulaciones
 */

const { query } = require('../utils/database');
const UserModel = require('../models/User.model');
const { runQuery } = require('../utils/neo4j');

const applicationController = {
    /**
     * Obtener mis postulaciones
     */
    async getMyApplications(req, res, next) {
        try {
            const result = await query(`
                SELECT
                    a.*,
                    v.title AS vacancy_title,
                    v.company AS vacancy_company,
                    v.location AS vacancy_location,
                    v.work_modality AS vacancy_modality
                FROM applications a
                JOIN vacancies v ON a.vacancy_id = v.id
                WHERE a.user_id = $1
                ORDER BY a.applied_at DESC
            `, [req.user.userId]);

            res.json({
                success: true,
                data: { applications: result.rows }
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Obtener tablero Kanban
     */
    async getKanbanBoard(req, res, next) {
        try {
            const result = await query(`
                SELECT
                    a.*,
                    v.title AS vacancy_title,
                    v.company AS vacancy_company,
                    v.location AS vacancy_location
                FROM applications a
                JOIN vacancies v ON a.vacancy_id = v.id
                WHERE a.user_id = $1
                ORDER BY a.status_updated_at DESC
            `, [req.user.userId]);

            // Organizar por columnas
            const board = {
                postulado: [],
                en_revision: [],
                entrevista: [],
                oferta: [],
                descartado: [],
                contratado: []
            };

            result.rows.forEach(app => {
                const status = app.status || 'postulado';
                if (board[status]) {
                    board[status].push(app);
                }
            });

            res.json({
                success: true,
                data: { board }
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Crear postulación
     */
    async apply(req, res, next) {
        try {
            const { vacancyId, compatibilityScore } = req.body;

            // Verificar si ya existe la postulación
            const existing = await query(
                'SELECT * FROM applications WHERE user_id = $1 AND vacancy_id = $2',
                [req.user.userId, vacancyId]
            );

            if (existing.rows.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Ya te has postulado a esta vacante'
                });
            }

            // Crear postulación
            const result = await query(`
                INSERT INTO applications (user_id, vacancy_id, compatibility_score, status)
                VALUES ($1, $2, $3, 'postulado')
                RETURNING *
            `, [req.user.userId, vacancyId, compatibilityScore || null]);

            // Registrar en Neo4j
            try {
                await runQuery(`
                    MATCH (c:Candidate {userId: $userId})
                    MATCH (v:Vacancy {externalId: $vacancyId})
                    MERGE (c)-[r:APPLIED_TO]->(v)
                    SET r.date = datetime(), r.score = $score
                `, {
                    userId: req.user.userId,
                    vacancyId,
                    score: compatibilityScore || 0
                });
            } catch (neo4jError) {
                console.error('Error registrando en Neo4j:', neo4jError);
            }

            // Crear notificación
            await query(`
                INSERT INTO notifications (user_id, application_id, type, title, message)
                VALUES ($1, $2, 'status_change', 'Postulación enviada',
                        'Tu postulación ha sido enviada exitosamente')
            `, [req.user.userId, result.rows[0].id]);

            res.status(201).json({
                success: true,
                message: 'Postulación creada exitosamente',
                data: { application: result.rows[0] }
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Obtener detalle de postulación
     */
    async getById(req, res, next) {
        try {
            const { id } = req.params;

            const result = await query(`
                SELECT
                    a.*,
                    v.*,
                    v.id AS vacancy_id
                FROM applications a
                JOIN vacancies v ON a.vacancy_id = v.id
                WHERE a.id = $1 AND a.user_id = $2
            `, [id, req.user.userId]);

            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Postulación no encontrada'
                });
            }

            // Obtener historial
            const history = await query(`
                SELECT * FROM application_history
                WHERE application_id = $1
                ORDER BY changed_at DESC
            `, [id]);

            res.json({
                success: true,
                data: {
                    application: result.rows[0],
                    history: history.rows
                }
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Actualizar estado (simulación)
     */
    async updateStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const validStatuses = ['postulado', 'en_revision', 'entrevista', 'oferta', 'contratado', 'descartado'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Estado inválido'
                });
            }

            const result = await query(`
                UPDATE applications
                SET status = $1
                WHERE id = $2 AND user_id = $3
                RETURNING *
            `, [status, id, req.user.userId]);

            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Postulación no encontrada'
                });
            }

            // Crear notificación
            const statusMessages = {
                en_revision: '¡Tu perfil está siendo revisado!',
                entrevista: '¡Felicidades! Has avanzado a la etapa de entrevista',
                oferta: '¡Excelente! Has recibido una oferta',
                contratado: '¡Felicidades! Has sido contratado',
                descartado: 'Tu postulación no ha sido seleccionada'
            };

            if (statusMessages[status]) {
                await query(`
                    INSERT INTO notifications (user_id, application_id, type, title, message)
                    VALUES ($1, $2, 'status_change', 'Actualización de postulación', $3)
                `, [req.user.userId, id, statusMessages[status]]);
            }

            res.json({
                success: true,
                message: 'Estado actualizado',
                data: { application: result.rows[0] }
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Activar/desactivar autopostulación
     */
    async toggleAutoApply(req, res, next) {
        try {
            const { enabled } = req.body;

            const user = await UserModel.toggleAutoApply(req.user.userId, enabled);

            res.json({
                success: true,
                message: enabled ? 'Autopostulación activada' : 'Autopostulación desactivada',
                data: { autoApplyEnabled: user.auto_apply_enabled }
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = applicationController;
