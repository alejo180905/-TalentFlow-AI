/**
 * TalentFlow AI - Backend API
 * Sistema de matching candidatos-vacantes con Neo4j
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Importar rutas
const authRoutes = require('./src/routes/auth.routes');
const profileRoutes = require('./src/routes/profile.routes');
const vacancyRoutes = require('./src/routes/vacancy.routes');
const applicationRoutes = require('./src/routes/application.routes');
const recommendationRoutes = require('./src/routes/recommendation.routes');

// Importar conexiones a BD
const { connectPostgres } = require('./src/utils/database');
const { connectNeo4j } = require('./src/utils/neo4j');

const app = express();
const PORT = process.env.PORT || 3000;

// =====================================================
// MIDDLEWARES
// =====================================================

// Seguridad
app.use(helmet());

// CORS
app.use(cors({
    origin: true,
    credentials: true
}));

// Logging
app.use(morgan('dev'));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (uploads de CV)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =====================================================
// RUTAS
// =====================================================

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'TalentFlow AI Backend'
    });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/vacancies', vacancyRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/recommendations', recommendationRoutes);

// =====================================================
// ERROR HANDLING
// =====================================================

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint no encontrado',
        path: req.originalUrl
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Error interno del servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// =====================================================
// INICIALIZACIÓN
// =====================================================

async function startServer() {
    try {
        // Conectar a PostgreSQL (requerido)
        await connectPostgres();
        console.log('✅ PostgreSQL conectado');

        // Conectar a Neo4j (opcional)
        const neo4jConnected = await connectNeo4j();
        if (neo4jConnected) {
            console.log('✅ Neo4j conectado');
        }

        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`
╔═══════════════════════════════════════════════╗
║     🚀 TalentFlow AI Backend                  ║
║     Puerto: ${PORT}                              ║
║     Modo: ${process.env.NODE_ENV || 'development'}                    ║
║     Neo4j: ${neo4jConnected ? 'Conectado' : 'No disponible'}                   ║
╚═══════════════════════════════════════════════╝
            `);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
}

startServer();

module.exports = app;
