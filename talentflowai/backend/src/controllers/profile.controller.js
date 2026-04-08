/**
 * Profile Controller
 */

const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const { validationResult } = require('express-validator');
const UserModel = require('../models/User.model');
const { query } = require('../utils/database');
const { addSkillsToCandidate, runQuery } = require('../utils/neo4j');
const cvService = require('../services/cv.service');

const profileController = {
    /**
     * Obtener perfil del usuario
     */
    async getProfile(req, res, next) {
        try {
            const user = await UserModel.findById(req.user.userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            // Obtener expectativas
            const expectations = await query(
                'SELECT * FROM user_expectations WHERE user_id = $1',
                [req.user.userId]
            );

            res.json({
                success: true,
                data: {
                    user,
                    expectations: expectations.rows[0] || null
                }
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Actualizar perfil
     */
    async updateProfile(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { fullName, phone, location } = req.body;
            const user = await UserModel.update(req.user.userId, {
                fullName,
                phone,
                location
            });

            res.json({
                success: true,
                message: 'Perfil actualizado',
                data: { user }
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Subir CV y extraer habilidades
     */
    async uploadCV(req, res, next) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No se proporcionó ningún archivo'
                });
            }

            const filePath = req.file.path;
            const cvUrl = `/uploads/${req.file.filename}`;

            // Extraer texto del CV
            let cvText = '';
            const ext = path.extname(req.file.originalname).toLowerCase();

            if (ext === '.pdf') {
                const dataBuffer = fs.readFileSync(filePath);
                const pdfData = await pdfParse(dataBuffer);
                cvText = pdfData.text;
            } else {
                // Para archivos Word, usar mammoth
                const mammoth = require('mammoth');
                const result = await mammoth.extractRawText({ path: filePath });
                cvText = result.value;
            }

            // Guardar en base de datos
            await UserModel.updateCV(req.user.userId, cvUrl, cvText);

            // Extraer habilidades con IA
            const skills = await cvService.extractSkills(cvText);

            // Guardar habilidades en Neo4j
            if (skills.length > 0) {
                await addSkillsToCandidate(req.user.userId, skills);
            }

            res.json({
                success: true,
                message: 'CV procesado exitosamente',
                data: {
                    cvUrl,
                    extractedSkills: skills
                }
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Obtener habilidades del usuario
     */
    async getSkills(req, res, next) {
        try {
            const records = await runQuery(`
                MATCH (c:Candidate {userId: $userId})-[r:HAS_SKILL]->(s:Skill)
                RETURN s.name AS name, s.displayName AS displayName,
                       s.category AS category, r.level AS level
            `, { userId: req.user.userId });

            const skills = records.map(record => ({
                name: record.get('name'),
                displayName: record.get('displayName'),
                category: record.get('category'),
                level: record.get('level')
            }));

            res.json({
                success: true,
                data: { skills }
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Actualizar habilidades manualmente
     */
    async updateSkills(req, res, next) {
        try {
            const { skills } = req.body;

            if (!Array.isArray(skills)) {
                return res.status(400).json({
                    success: false,
                    message: 'Se requiere un array de habilidades'
                });
            }

            // Eliminar skills existentes y agregar nuevas
            await runQuery(`
                MATCH (c:Candidate {userId: $userId})-[r:HAS_SKILL]->()
                DELETE r
            `, { userId: req.user.userId });

            await addSkillsToCandidate(req.user.userId, skills);

            res.json({
                success: true,
                message: 'Habilidades actualizadas',
                data: { skills }
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Obtener expectativas laborales
     */
    async getExpectations(req, res, next) {
        try {
            const result = await query(
                'SELECT * FROM user_expectations WHERE user_id = $1',
                [req.user.userId]
            );

            res.json({
                success: true,
                data: { expectations: result.rows[0] || null }
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Actualizar expectativas laborales
     */
    async updateExpectations(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const {
                minSalary,
                maxSalary,
                currency,
                workModality,
                preferredLocations,
                willingToRelocate
            } = req.body;

            // Upsert expectations
            const result = await query(`
                INSERT INTO user_expectations
                    (user_id, min_salary, max_salary, currency, work_modality,
                     preferred_locations, willing_to_relocate)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (user_id)
                DO UPDATE SET
                    min_salary = EXCLUDED.min_salary,
                    max_salary = EXCLUDED.max_salary,
                    currency = EXCLUDED.currency,
                    work_modality = EXCLUDED.work_modality,
                    preferred_locations = EXCLUDED.preferred_locations,
                    willing_to_relocate = EXCLUDED.willing_to_relocate,
                    updated_at = CURRENT_TIMESTAMP
                RETURNING *
            `, [
                req.user.userId,
                minSalary,
                maxSalary,
                currency || 'COP',
                workModality,
                preferredLocations,
                willingToRelocate || false
            ]);

            // Marcar perfil como completo
            await UserModel.update(req.user.userId, { profileComplete: true });

            res.json({
                success: true,
                message: 'Expectativas actualizadas',
                data: { expectations: result.rows[0] }
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = profileController;
