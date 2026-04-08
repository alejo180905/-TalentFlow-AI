/**
 * Auth Service - Manejo de autenticación
 */

const authService = {
    user: null,

    /**
     * Verificar si hay sesión activa
     */
    isAuthenticated() {
        return !!localStorage.getItem('token');
    },

    /**
     * Obtener usuario actual
     */
    getUser() {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    },

    /**
     * Guardar sesión
     */
    saveSession(token, user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        apiService.setToken(token);
        this.user = user;
    },

    /**
     * Cerrar sesión
     */
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        apiService.clearToken();
        this.user = null;
    },

    /**
     * Registrar usuario
     */
    async register(fullName, email, password) {
        const result = await apiService.register({ fullName, email, password });
        if (result.success) {
            this.saveSession(result.data.token, result.data.user);
        }
        return result;
    },

    /**
     * Iniciar sesión
     */
    async login(email, password) {
        const result = await apiService.login({ email, password });
        if (result.success) {
            this.saveSession(result.data.token, result.data.user);
        }
        return result;
    }
};

// Exportar para uso global
window.authService = authService;
