/**
 * API Service - Comunicación con el backend
 */

const API_URL = 'http://localhost:3000/api';

const apiService = {
    token: localStorage.getItem('token'),

    /**
     * Configurar headers para las peticiones
     */
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    },

    /**
     * Setear token de autenticación
     */
    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    },

    /**
     * Limpiar token
     */
    clearToken() {
        this.token = null;
        localStorage.removeItem('token');
    },

    /**
     * Petición genérica
     */
    async request(endpoint, method = 'GET', data = null) {
        const config = {
            method,
            headers: this.getHeaders()
        };

        if (data && method !== 'GET') {
            config.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(`${API_URL}${endpoint}`, config);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Error en la petición');
            }

            return result;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    /**
     * Subir archivo
     */
    async uploadFile(endpoint, file) {
        const formData = new FormData();
        formData.append('cv', file);

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
                body: formData
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Error subiendo archivo');
            }

            return result;
        } catch (error) {
            console.error('Upload Error:', error);
            throw error;
        }
    },

    // =====================================================
    // AUTH
    // =====================================================

    async register(data) {
        return this.request('/auth/register', 'POST', data);
    },

    async login(data) {
        return this.request('/auth/login', 'POST', data);
    },

    async getCurrentUser() {
        return this.request('/auth/me');
    },

    // =====================================================
    // PROFILE
    // =====================================================

    async getProfile() {
        return this.request('/profile');
    },

    async updateProfile(data) {
        return this.request('/profile', 'PUT', data);
    },

    async uploadCV(file) {
        return this.uploadFile('/profile/cv', file);
    },

    async getSkills() {
        return this.request('/profile/skills');
    },

    async updateSkills(skills) {
        return this.request('/profile/skills', 'PUT', { skills });
    },

    async getExpectations() {
        return this.request('/profile/expectations');
    },

    async updateExpectations(data) {
        return this.request('/profile/expectations', 'PUT', data);
    },

    // =====================================================
    // VACANCIES
    // =====================================================

    async getVacancies(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/vacancies${queryString ? '?' + queryString : ''}`);
    },

    async getVacancy(id) {
        return this.request(`/vacancies/${id}`);
    },

    async searchVacancies(params) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/vacancies/search?${queryString}`);
    },

    // =====================================================
    // RECOMMENDATIONS
    // =====================================================

    async getRecommendations(limit = 20) {
        return this.request(`/recommendations?limit=${limit}`);
    },

    async getScoreBreakdown(vacancyId) {
        return this.request(`/recommendations/score/${vacancyId}`);
    },

    // =====================================================
    // APPLICATIONS
    // =====================================================

    async getApplications() {
        return this.request('/applications');
    },

    async getKanbanBoard() {
        return this.request('/applications/board');
    },

    async apply(vacancyId, compatibilityScore) {
        return this.request('/applications', 'POST', { vacancyId, compatibilityScore });
    },

    async getApplication(id) {
        return this.request(`/applications/${id}`);
    },

    async updateApplicationStatus(id, status) {
        return this.request(`/applications/${id}/status`, 'PATCH', { status });
    },

    async toggleAutoApply(enabled) {
        return this.request('/applications/auto-apply', 'POST', { enabled });
    }
};

// Exportar para uso global
window.apiService = apiService;
