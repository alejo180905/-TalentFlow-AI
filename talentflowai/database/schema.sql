-- =====================================================
-- TalentFlow AI - Schema PostgreSQL
-- Base de datos relacional para usuarios y postulaciones
-- =====================================================

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLA: users (Candidatos)
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    location VARCHAR(255),
    cv_url VARCHAR(500),
    cv_text TEXT,
    profile_complete BOOLEAN DEFAULT FALSE,
    auto_apply_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: user_expectations (Expectativas laborales)
-- =====================================================
CREATE TABLE user_expectations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    min_salary INTEGER,
    max_salary INTEGER,
    currency VARCHAR(10) DEFAULT 'COP',
    work_modality VARCHAR(50), -- 'remote', 'hybrid', 'onsite'
    preferred_locations TEXT[], -- Array de ubicaciones
    willing_to_relocate BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- =====================================================
-- TABLA: vacancies (Vacantes - cache local del mock API)
-- =====================================================
CREATE TABLE vacancies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_id VARCHAR(100) UNIQUE,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    work_modality VARCHAR(50),
    min_salary INTEGER,
    max_salary INTEGER,
    currency VARCHAR(10) DEFAULT 'COP',
    required_skills TEXT[],
    experience_years INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    source VARCHAR(100) DEFAULT 'mock_api',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: applications (Postulaciones)
-- =====================================================
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vacancy_id UUID NOT NULL REFERENCES vacancies(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'postulado',
    -- Estados: postulado, en_revision, entrevista, oferta, contratado, descartado
    compatibility_score DECIMAL(5,2),
    is_auto_applied BOOLEAN DEFAULT FALSE,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    UNIQUE(user_id, vacancy_id)
);

-- =====================================================
-- TABLA: notifications (Notificaciones simuladas)
-- =====================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'status_change', 'new_recommendation', 'auto_apply'
    title VARCHAR(255) NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: application_history (Historial de cambios de estado)
-- =====================================================
CREATE TABLE application_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- =====================================================
-- ÍNDICES
-- =====================================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_applications_user ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_vacancies_active ON vacancies(is_active);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read);

-- =====================================================
-- TRIGGER: Actualizar updated_at automáticamente
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expectations_updated_at
    BEFORE UPDATE ON user_expectations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vacancies_updated_at
    BEFORE UPDATE ON vacancies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TRIGGER: Registrar historial de cambios de estado
-- =====================================================
CREATE OR REPLACE FUNCTION log_application_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO application_history (application_id, previous_status, new_status)
        VALUES (NEW.id, OLD.status, NEW.status);

        NEW.status_updated_at = CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER application_status_change
    BEFORE UPDATE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION log_application_status_change();