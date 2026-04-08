/**
 * TalentFlow AI - Main Application
 */

// =====================================================
// INICIALIZACIÓN
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // Verificar sesión
    updateAuthUI();

    // Configurar navegación
    setupNavigation();

    // Configurar formularios
    setupForms();

    // Cargar datos iniciales
    if (authService.isAuthenticated()) {
        loadInitialData();
    }
}

// =====================================================
// NAVEGACIÓN
// =====================================================

function setupNavigation() {
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.dataset.page;
            navigateTo(page);
        });
    });
}

function navigateTo(page) {
    // Verificar autenticación para páginas protegidas
    const protectedPages = ['recommendations', 'applications', 'profile'];
    if (protectedPages.includes(page) && !authService.isAuthenticated()) {
        showToast('Debes iniciar sesión para acceder', 'error');
        showModal('login');
        return;
    }

    // Ocultar todas las páginas
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    // Mostrar página seleccionada
    const pageElement = document.getElementById(`${page}Page`);
    if (pageElement) {
        pageElement.classList.add('active');
    }

    // Actualizar navegación activa
    document.querySelectorAll('.nav a').forEach(a => a.classList.remove('active'));
    document.querySelector(`[data-page="${page}"]`)?.classList.add('active');

    // Cargar datos de la página
    loadPageData(page);
}

function loadPageData(page) {
    switch(page) {
        case 'vacancies':
            loadVacancies();
            break;
        case 'recommendations':
            loadRecommendations();
            break;
        case 'applications':
            loadKanbanBoard();
            break;
        case 'profile':
            loadProfile();
            break;
    }
}

// =====================================================
// AUTENTICACIÓN UI
// =====================================================

function updateAuthUI() {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');

    if (authService.isAuthenticated()) {
        const user = authService.getUser();
        authButtons.style.display = 'none';
        userMenu.style.display = 'flex';
        userName.textContent = user?.fullName || 'Usuario';
    } else {
        authButtons.style.display = 'flex';
        userMenu.style.display = 'none';
    }
}

function logout() {
    authService.logout();
    updateAuthUI();
    navigateTo('home');
    showToast('Sesión cerrada', 'info');
}

// =====================================================
// MODALES
// =====================================================

function showModal(type) {
    document.getElementById(`${type}Modal`).classList.add('show');
}

function closeModal(type) {
    document.getElementById(`${type}Modal`).classList.remove('show');
}

// =====================================================
// FORMULARIOS
// =====================================================

function setupForms() {
    // Login
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            await authService.login(email, password);
            closeModal('login');
            updateAuthUI();
            showToast('¡Bienvenido!', 'success');
            loadInitialData();
        } catch (error) {
            showToast(error.message, 'error');
        }
    });

    // Register
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const fullName = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        try {
            await authService.register(fullName, email, password);
            closeModal('register');
            updateAuthUI();
            showToast('¡Cuenta creada exitosamente!', 'success');
            navigateTo('profile');
        } catch (error) {
            showToast(error.message, 'error');
        }
    });

    // Profile
    document.getElementById('profileForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            fullName: document.getElementById('profileName').value,
            phone: document.getElementById('profilePhone').value,
            location: document.getElementById('profileLocation').value
        };

        try {
            await apiService.updateProfile(data);
            showToast('Perfil actualizado', 'success');
        } catch (error) {
            showToast(error.message, 'error');
        }
    });

    // CV Upload
    document.getElementById('cvFile').addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        document.getElementById('cvFileName').textContent = file.name;

        try {
            showToast('Procesando CV...', 'info');
            const result = await apiService.uploadCV(file);
            displayExtractedSkills(result.data.extractedSkills);
            showToast('CV procesado exitosamente', 'success');
        } catch (error) {
            showToast(error.message, 'error');
        }
    });

    // Expectations
    document.getElementById('expectationsForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const locations = document.getElementById('preferredLocations').value;
        const data = {
            minSalary: parseInt(document.getElementById('minSalary').value) || null,
            maxSalary: parseInt(document.getElementById('maxSalary').value) || null,
            workModality: document.getElementById('workModality').value || null,
            preferredLocations: locations ? locations.split(',').map(l => l.trim()) : null
        };

        try {
            await apiService.updateExpectations(data);
            showToast('Expectativas actualizadas', 'success');
        } catch (error) {
            showToast(error.message, 'error');
        }
    });

    // Auto Apply Toggle
    document.getElementById('autoApplyToggle').addEventListener('change', async (e) => {
        try {
            await apiService.toggleAutoApply(e.target.checked);
            showToast(e.target.checked ? 'Autopostulación activada' : 'Autopostulación desactivada', 'success');
        } catch (error) {
            showToast(error.message, 'error');
            e.target.checked = !e.target.checked;
        }
    });

    // Search filters
    document.getElementById('searchVacancy').addEventListener('input', debounce(loadVacancies, 300));
    document.getElementById('filterModality').addEventListener('change', loadVacancies);
    document.getElementById('filterLocation').addEventListener('change', loadVacancies);
}

// =====================================================
// CARGA DE DATOS
// =====================================================

function loadInitialData() {
    // Los datos se cargan cuando se navega a cada página
}

async function loadVacancies() {
    const container = document.getElementById('vacanciesList');
    container.innerHTML = '<p>Cargando vacantes...</p>';

    try {
        const params = {
            modality: document.getElementById('filterModality').value,
            location: document.getElementById('filterLocation').value
        };

        // Filtrar params vacíos
        Object.keys(params).forEach(key => !params[key] && delete params[key]);

        const result = await apiService.getVacancies(params);
        displayVacancies(result.data.vacancies, container);
    } catch (error) {
        container.innerHTML = '<p>Error cargando vacantes</p>';
    }
}

async function loadRecommendations() {
    const container = document.getElementById('recommendationsList');
    container.innerHTML = '<p>Cargando recomendaciones...</p>';

    try {
        const result = await apiService.getRecommendations();
        displayVacancies(result.data.recommendations, container, true);
    } catch (error) {
        container.innerHTML = '<p>Error cargando recomendaciones</p>';
    }
}

async function loadKanbanBoard() {
    try {
        const result = await apiService.getKanbanBoard();
        displayKanban(result.data.board);
    } catch (error) {
        showToast('Error cargando postulaciones', 'error');
    }
}

async function loadProfile() {
    try {
        const result = await apiService.getProfile();
        const user = result.data.user;
        const expectations = result.data.expectations;

        // Llenar formulario de perfil
        document.getElementById('profileName').value = user.full_name || '';
        document.getElementById('profileEmail').value = user.email || '';
        document.getElementById('profilePhone').value = user.phone || '';
        document.getElementById('profileLocation').value = user.location || '';

        // Llenar expectativas
        if (expectations) {
            document.getElementById('minSalary').value = expectations.min_salary || '';
            document.getElementById('maxSalary').value = expectations.max_salary || '';
            document.getElementById('workModality').value = expectations.work_modality || '';
            document.getElementById('preferredLocations').value =
                expectations.preferred_locations?.join(', ') || '';
        }

        // Cargar autopostulación
        document.getElementById('autoApplyToggle').checked = user.auto_apply_enabled;

        // Cargar skills
        const skillsResult = await apiService.getSkills();
        displayExtractedSkills(skillsResult.data.skills);
    } catch (error) {
        showToast('Error cargando perfil', 'error');
    }
}

// =====================================================
// RENDERIZADO
// =====================================================

function displayVacancies(vacancies, container, showScore = false) {
    if (!vacancies || vacancies.length === 0) {
        container.innerHTML = '<p>No se encontraron vacantes</p>';
        return;
    }

    container.innerHTML = vacancies.map(v => `
        <div class="vacancy-card">
            ${showScore && v.compatibilityScore ?
                `<span class="score-badge">${v.compatibilityScore}% Match</span>` : ''}
            <h3>${v.title}</h3>
            <p class="company">${v.company}</p>
            <div class="details">
                <span><i class="fas fa-map-marker-alt"></i> ${v.location}</span>
                <span><i class="fas fa-building"></i> ${formatModality(v.work_modality || v.workModality)}</span>
            </div>
            <div class="skills">
                ${(v.required_skills || v.skills || []).slice(0, 4).map(s =>
                    `<span class="skill-tag">${s}</span>`
                ).join('')}
            </div>
            <p class="salary">$${formatNumber(v.min_salary || v.minSalary)} - $${formatNumber(v.max_salary || v.maxSalary)} COP</p>
            <button class="btn btn-primary" onclick="applyToVacancy('${v.id || v.externalId}', ${v.compatibilityScore || 0})">
                <i class="fas fa-paper-plane"></i> Postularme
            </button>
        </div>
    `).join('');
}

function displayKanban(board) {
    const columns = ['postulado', 'en_revision', 'entrevista', 'oferta', 'descartado'];

    columns.forEach(status => {
        const container = document.getElementById(`col-${status}`);
        const applications = board[status] || [];

        container.innerHTML = applications.map(app => `
            <div class="kanban-card" onclick="viewApplication('${app.id}')">
                <h4>${app.vacancy_title}</h4>
                <p class="company">${app.vacancy_company}</p>
                ${app.compatibility_score ?
                    `<span class="score">${app.compatibility_score}% Match</span>` : ''}
            </div>
        `).join('') || '<p style="color: #888; font-size: 0.9rem;">Sin postulaciones</p>';
    });
}

function displayExtractedSkills(skills) {
    const container = document.getElementById('extractedSkills');
    if (!skills || skills.length === 0) {
        container.innerHTML = '<p style="color: #888;">No hay habilidades extraídas</p>';
        return;
    }

    container.innerHTML = skills.map(s =>
        `<span class="skill-tag">${s.displayName || s.name}</span>`
    ).join('');
}

// =====================================================
// ACCIONES
// =====================================================

async function applyToVacancy(vacancyId, score) {
    if (!authService.isAuthenticated()) {
        showToast('Debes iniciar sesión para postularte', 'error');
        showModal('login');
        return;
    }

    try {
        await apiService.apply(vacancyId, score);
        showToast('¡Postulación enviada exitosamente!', 'success');
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function viewApplication(id) {
    // TODO: Mostrar detalle de la aplicación
    console.log('Ver aplicación:', id);
}

// =====================================================
// UTILIDADES
// =====================================================

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${message}
    `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function formatModality(modality) {
    const map = {
        'remote': 'Remoto',
        'hybrid': 'Híbrido',
        'onsite': 'Presencial'
    };
    return map[modality] || modality;
}

function formatNumber(num) {
    if (!num) return '0';
    return new Intl.NumberFormat('es-CO').format(num);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// =====================================================
// DATOS DE EJEMPLO (cuando no hay backend)
// =====================================================

// Mock data para desarrollo sin backend
const mockVacancies = [
    {
        id: '1',
        title: 'Senior Fullstack Developer',
        company: 'TechCorp Colombia',
        location: 'Medellín',
        work_modality: 'hybrid',
        min_salary: 8000000,
        max_salary: 12000000,
        required_skills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL'],
        compatibilityScore: 92
    },
    {
        id: '2',
        title: 'Backend Developer Python',
        company: 'DataTech',
        location: 'Bogotá',
        work_modality: 'remote',
        min_salary: 6000000,
        max_salary: 9000000,
        required_skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
        compatibilityScore: 78
    },
    {
        id: '3',
        title: 'Frontend Developer React',
        company: 'StartupAI',
        location: 'Medellín',
        work_modality: 'remote',
        min_salary: 5000000,
        max_salary: 8000000,
        required_skills: ['JavaScript', 'React', 'TypeScript', 'CSS'],
        compatibilityScore: 85
    }
];

// Override para desarrollo sin backend
const originalGetVacancies = apiService.getVacancies;
apiService.getVacancies = async function(params) {
    try {
        return await originalGetVacancies.call(this, params);
    } catch (error) {
        console.log('Usando datos mock para vacantes');
        return { data: { vacancies: mockVacancies } };
    }
};

const originalGetRecommendations = apiService.getRecommendations;
apiService.getRecommendations = async function(limit) {
    try {
        return await originalGetRecommendations.call(this, limit);
    } catch (error) {
        console.log('Usando datos mock para recomendaciones');
        return { data: { recommendations: mockVacancies.sort((a, b) => b.compatibilityScore - a.compatibilityScore) } };
    }
};

const originalGetKanbanBoard = apiService.getKanbanBoard;
apiService.getKanbanBoard = async function() {
    try {
        return await originalGetKanbanBoard.call(this);
    } catch (error) {
        console.log('Usando datos mock para kanban');
        return {
            data: {
                board: {
                    postulado: [{ id: '1', vacancy_title: 'Senior Fullstack Developer', vacancy_company: 'TechCorp', compatibility_score: 92 }],
                    en_revision: [{ id: '2', vacancy_title: 'Backend Developer', vacancy_company: 'DataTech', compatibility_score: 78 }],
                    entrevista: [],
                    oferta: [],
                    descartado: []
                }
            }
        };
    }
};
