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

async function ensureUserSkillsTable() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS user_skills (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            name VARCHAR(255) NOT NULL,
            display_name VARCHAR(255) NOT NULL,
            category VARCHAR(100) NOT NULL,
            level VARCHAR(50) DEFAULT 'intermediate',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, name)
        )
    `);

    await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(user_id)
    `);
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
    connectPostgres,
    ensureUserSkillsTable
};
