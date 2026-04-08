/**
 * Vacancy Routes - Vacantes
 */

const express = require('express');
const router = express.Router();
const vacancyController = require('../controllers/vacancy.controller');
const authMiddleware = require('../utils/authMiddleware');

/**
 * GET /api/vacancies
 * Obtener lista de vacantes (pública)
 */
router.get('/', vacancyController.getAll);

/**
 * GET /api/vacancies/:id
 * Obtener vacante por ID
 */
router.get('/:id', vacancyController.getById);

/**
 * GET /api/vacancies/search
 * Buscar vacantes con filtros
 */
router.get('/search', vacancyController.search);

module.exports = router;
