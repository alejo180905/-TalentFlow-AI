/**
 * Application Routes - Postulaciones
 */

const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller');
const authMiddleware = require('../utils/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

/**
 * GET /api/applications
 * Obtener postulaciones del usuario
 */
router.get('/', applicationController.getMyApplications);

/**
 * GET /api/applications/board
 * Obtener tablero Kanban de postulaciones
 */
router.get('/board', applicationController.getKanbanBoard);

/**
 * POST /api/applications
 * Crear nueva postulación
 */
router.post('/', applicationController.apply);

/**
 * GET /api/applications/:id
 * Obtener detalle de una postulación
 */
router.get('/:id', applicationController.getById);

/**
 * PATCH /api/applications/:id/status
 * Actualizar estado (simulación)
 */
router.patch('/:id/status', applicationController.updateStatus);

/**
 * POST /api/applications/auto-apply
 * Activar/desactivar autopostulación
 */
router.post('/auto-apply', applicationController.toggleAutoApply);

module.exports = router;
