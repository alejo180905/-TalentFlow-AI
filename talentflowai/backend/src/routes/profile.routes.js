/**
 * Profile Routes - Perfil de usuario y expectativas
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { body } = require('express-validator');
const profileController = require('../controllers/profile.controller');
const authMiddleware = require('../utils/authMiddleware');

// Configuración de Multer para subir CVs
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.UPLOAD_DIR || './uploads');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `cv-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.pdf', '.doc', '.docx'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos PDF y Word'));
        }
    }
});

// Todas las rutas requieren autenticación
router.use(authMiddleware);

/**
 * GET /api/profile
 * Obtener perfil del usuario actual
 */
router.get('/', profileController.getProfile);

/**
 * PUT /api/profile
 * Actualizar perfil
 */
router.put('/', [
    body('fullName').optional().trim().isLength({ min: 2 }),
    body('phone').optional().trim(),
    body('location').optional().trim()
], profileController.updateProfile);

/**
 * POST /api/profile/cv
 * Subir CV
 */
router.post('/cv', upload.single('cv'), profileController.uploadCV);

/**
 * GET /api/profile/skills
 * Obtener habilidades extraídas
 */
router.get('/skills', profileController.getSkills);

/**
 * PUT /api/profile/skills
 * Actualizar habilidades manualmente
 */
router.put('/skills', profileController.updateSkills);

/**
 * GET /api/profile/expectations
 * Obtener expectativas laborales
 */
router.get('/expectations', profileController.getExpectations);

/**
 * PUT /api/profile/expectations
 * Actualizar expectativas laborales
 */
router.put('/expectations', [
    body('minSalary').optional().isInt({ min: 0 }),
    body('maxSalary').optional().isInt({ min: 0 }),
    body('workModality').optional().isIn(['remote', 'hybrid', 'onsite']),
    body('preferredLocations').optional().isArray()
], profileController.updateExpectations);

module.exports = router;
