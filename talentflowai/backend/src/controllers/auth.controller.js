/**
 * Auth Controller
 */

const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const UserModel = require('../models/User.model');
const { createCandidateNode } = require('../utils/neo4j');

const authController = {
    /**
     * Registrar nuevo usuario
     */
    async register(req, res, next) {
        try {
            // Validar campos
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { email, password, fullName, phone, location } = req.body;

            // Verificar si el email ya existe
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'El email ya está registrado'
                });
            }

            // Crear usuario en PostgreSQL
            const user = await UserModel.create({
                email,
                password,
                fullName,
                phone,
                location
            });

            // Crear nodo en Neo4j
            try {
                await createCandidateNode(user.id, email, fullName);
            } catch (neo4jError) {
                console.error('Error creando nodo en Neo4j:', neo4jError);
                // No fallar el registro por esto
            }

            // Generar token JWT
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET || 'secret',
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente',
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        fullName: user.full_name
                    },
                    token
                }
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Iniciar sesión
     */
    async login(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { email, password } = req.body;

            // Buscar usuario
            const user = await UserModel.findByEmail(email);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas'
                });
            }

            // Verificar contraseña
            const isValidPassword = await UserModel.verifyPassword(password, user.password_hash);
            if (!isValidPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas'
                });
            }

            // Generar token
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET || 'secret',
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            res.json({
                success: true,
                message: 'Inicio de sesión exitoso',
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        fullName: user.full_name,
                        profileComplete: user.profile_complete
                    },
                    token
                }
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Obtener usuario actual
     */
    async getCurrentUser(req, res, next) {
        try {
            // El middleware de auth debería agregar req.user
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'No autenticado'
                });
            }

            const user = await UserModel.findById(req.user.userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            res.json({
                success: true,
                data: { user }
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = authController;
