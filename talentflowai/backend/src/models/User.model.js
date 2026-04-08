/**
 * User Model - PostgreSQL
 */

const { query } = require('../utils/database');
const bcrypt = require('bcryptjs');

const UserModel = {
    /**
     * Crear un nuevo usuario
     */
    async create({ email, password, fullName, phone, location }) {
        const passwordHash = await bcrypt.hash(password, 12);

        const result = await query(
            `INSERT INTO users (email, password_hash, full_name, phone, location)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, email, full_name, phone, location, created_at`,
            [email, passwordHash, fullName, phone, location]
        );

        return result.rows[0];
    },

    /**
     * Buscar usuario por email
     */
    async findByEmail(email) {
        const result = await query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0];
    },

    /**
     * Buscar usuario por ID
     */
    async findById(id) {
        const result = await query(
            `SELECT id, email, full_name, phone, location, cv_url,
                    profile_complete, auto_apply_enabled, created_at
             FROM users WHERE id = $1`,
            [id]
        );
        return result.rows[0];
    },

    /**
     * Actualizar perfil
     */
    async update(id, data) {
        const fields = [];
        const values = [];
        let paramCount = 1;

        for (const [key, value] of Object.entries(data)) {
            if (value !== undefined) {
                // Convert camelCase to snake_case
                const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
                fields.push(`${snakeKey} = $${paramCount}`);
                values.push(value);
                paramCount++;
            }
        }

        if (fields.length === 0) return null;

        values.push(id);
        const result = await query(
            `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
            values
        );

        return result.rows[0];
    },

    /**
     * Actualizar CV
     */
    async updateCV(id, cvUrl, cvText) {
        const result = await query(
            `UPDATE users SET cv_url = $1, cv_text = $2 WHERE id = $3 RETURNING *`,
            [cvUrl, cvText, id]
        );
        return result.rows[0];
    },

    /**
     * Verificar contraseña
     */
    async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    },

    /**
     * Activar/Desactivar autopostulación
     */
    async toggleAutoApply(id, enabled) {
        const result = await query(
            `UPDATE users SET auto_apply_enabled = $1 WHERE id = $2 RETURNING *`,
            [enabled, id]
        );
        return result.rows[0];
    }
};

module.exports = UserModel;
