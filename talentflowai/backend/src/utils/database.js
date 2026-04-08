/**
 * Conexión a PostgreSQL
 */

const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    database: process.env.POSTGRES_DB || 'talentflow',
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Test connection
async function connectPostgres() {
    try {
        const client = await pool.connect();
        console.log('📦 PostgreSQL: Conexión establecida');
        client.release();
        return true;
    } catch (error) {
        console.error('❌ PostgreSQL: Error de conexión', error.message);
        throw error;
    }
}

// Query helper
async function query(text, params) {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;

    if (process.env.NODE_ENV === 'development') {
        console.log('📊 Query ejecutada', { text: text.substring(0, 50), duration, rows: res.rowCount });
    }

    return res;
}

// Get a client for transactions
async function getClient() {
    return await pool.connect();
}

module.exports = {
    pool,
    query,
    getClient,
    connectPostgres
};
