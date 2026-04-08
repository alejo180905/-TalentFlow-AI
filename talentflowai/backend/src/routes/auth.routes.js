/**
 * Auth Routes - Registro e inicio de sesión
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');

// Validaciones
const registerValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Email inválido'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener al menos 8 caracteres'),
    body('fullName')
        .trim()
        .isLength({ min: 2 })
        .withMessage('El nombre es requerido')
];

const loginValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Email inválido'),
    body('password')
        .notEmpty()
        .withMessage('Contraseña requerida')
];

/**
 * POST /api/auth/register
 * Registrar nuevo usuario
 */
router.post('/register', registerValidation, authController.register);

/**
 * POST /api/auth/login
 * Iniciar sesión
 */
router.post('/login', loginValidation, authController.login);

/**
 * GET /api/auth/me
 * Obtener usuario actual (requiere autenticación)
 */
router.get('/me', authController.getCurrentUser);

module.exports = router;
