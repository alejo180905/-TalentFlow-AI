/**
 * Recommendation Routes - Motor de recomendación
 */

const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendation.controller');
const authMiddleware = require('../utils/authMiddleware');

// Requiere autenticación
router.use(authMiddleware);

/**
 * GET /api/recommendations
 * Obtener vacantes recomendadas para el usuario
 */
router.get('/', recommendationController.getRecommendations);

/**
 * GET /api/recommendations/score/:vacancyId
 * Obtener desglose del score de compatibilidad
 */
router.get('/score/:vacancyId', recommendationController.getScoreBreakdown);

module.exports = router;
