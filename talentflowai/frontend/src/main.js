import "./styles/main.css";

const API_BASE = "http://localhost:4000/api";

const state = {
  token: localStorage.getItem("talentflow_token") || "",
  user: JSON.parse(localStorage.getItem("talentflow_user") || "null"),
  profile: null,
  jobs: [],
  recommendations: [],
  applications: []
};

const app = document.querySelector("#app");

function setStatus(message, isError = false) {
  const statusEl = document.querySelector("#status");
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.style.color = isError ? "#b91c1c" : "#065f46";
}

async function api(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (state.token) {
    headers.Authorization = `Bearer ${state.token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Error de servidor");
  }

  return data;
}

function saveSession(token, user) {
  state.token = token;
  state.user = user;
  localStorage.setItem("talentflow_token", token);
  localStorage.setItem("talentflow_user", JSON.stringify(user));
}

function clearSession() {
  state.token = "";
  state.user = null;
  state.profile = null;
  localStorage.removeItem("talentflow_token");
  localStorage.removeItem("talentflow_user");
}

function render() {
  app.innerHTML = `
    <main class="container">
      <h1>TalentFlow AI - MVP Entrega 1</h1>
      <p class="small">Flujo: autenticación → perfil → vacantes → recomendación → postulación → tablero.</p>
      <div id="status" class="status"></div>

      <section class="card ${state.user ? "hidden" : ""}" id="auth-section">
        <h2>1) Registro / Login</h2>
        <div class="grid">
          <div>
            <h3>Registro</h3>
            <label>Nombre</label>
            <input id="register-name" placeholder="Tu nombre" />
            <label>Email</label>
            <input id="register-email" placeholder="correo@ejemplo.com" />
            <label>Password</label>
            <input id="register-password" type="password" placeholder="******" />
            <button id="register-btn">Crear cuenta</button>
          </div>
          <div>
            <h3>Login</h3>
            <label>Email</label>
            <input id="login-email" placeholder="correo@ejemplo.com" />
            <label>Password</label>
            <input id="login-password" type="password" placeholder="******" />
            <button id="login-btn">Ingresar</button>
          </div>
        </div>
      </section>

      <section class="card ${state.user ? "" : "hidden"}" id="workspace-section">
        <div class="row">
          <h2>Usuario: ${state.user?.name || "-"}</h2>
          <button class="secondary" id="logout-btn">Cerrar sesión</button>
        </div>
      </section>

      <section class="card ${state.user ? "" : "hidden"}">
        <h2>2) Perfil y expectativas laborales</h2>
        <div class="grid">
          <div>
            <label>Skills (separadas por coma)</label>
            <input id="profile-skills" placeholder="javascript, react, node.js" />
          </div>
          <div>
            <label>Años de experiencia</label>
            <input id="profile-years" type="number" placeholder="2" />
          </div>
          <div>
            <label>Salario esperado</label>
            <input id="profile-salary" type="number" placeholder="3000" />
          </div>
          <div>
            <label>Ubicación</label>
            <input id="profile-location" placeholder="Bogotá" />
          </div>
          <div>
            <label>Modalidad</label>
            <select id="profile-modality">
              <option value="">Selecciona</option>
              <option value="Remoto">Remoto</option>
              <option value="Híbrido">Híbrido</option>
              <option value="Presencial">Presencial</option>
            </select>
          </div>
          <div>
            <label>Resumen profesional</label>
            <textarea id="profile-summary" placeholder="Resumen breve"></textarea>
          </div>
        </div>
        <div class="row">
          <button id="save-profile-btn">Guardar perfil</button>
          <button class="ghost" id="load-profile-btn">Recargar perfil</button>
        </div>
      </section>

      <section class="card ${state.user ? "" : "hidden"}">
        <h2>3) Vacantes y recomendaciones</h2>
        <div class="row">
          <button id="load-jobs-btn">Ver vacantes</button>
          <button id="load-recommendations-btn">Calcular recomendaciones</button>
          <button id="auto-apply-btn">Auto postular top 2</button>
        </div>

        <h3>Vacantes</h3>
        <div id="jobs-list" class="list"></div>

        <h3>Recomendaciones (score)</h3>
        <div id="recommendations-list" class="list"></div>
      </section>

      <section class="card ${state.user ? "" : "hidden"}">
        <h2>4) Tablero de postulaciones</h2>
        <div class="row">
          <button id="load-applications-btn">Actualizar tablero</button>
        </div>
        <div id="board" class="columns"></div>
      </section>
    </main>
  `;

  bindEvents();
  paintData();
}

function paintData() {
  if (!state.user) {
    return;
  }

  const profile = state.profile || {};
  const skillsInput = document.querySelector("#profile-skills");
  const yearsInput = document.querySelector("#profile-years");
  const salaryInput = document.querySelector("#profile-salary");
  const locationInput = document.querySelector("#profile-location");
  const modalitySelect = document.querySelector("#profile-modality");
  const summaryInput = document.querySelector("#profile-summary");

  if (skillsInput) skillsInput.value = (profile.skills || []).join(", ");
  if (yearsInput) yearsInput.value = profile.yearsExperience ?? "";
  if (salaryInput) salaryInput.value = profile.expectedSalary ?? "";
  if (locationInput) locationInput.value = profile.location || "";
  if (modalitySelect) modalitySelect.value = profile.modality || "";
  if (summaryInput) summaryInput.value = profile.summary || "";

  const jobsList = document.querySelector("#jobs-list");
  jobsList.innerHTML = state.jobs
    .map(
      (job) => `
        <article class="card">
          <div class="job-title">${job.title} - ${job.company}</div>
          <div class="meta">${job.location} | ${job.modality} | $${job.salary}</div>
          <p>${job.description}</p>
          <div>${job.skills.map((skill) => `<span class="badge">${skill}</span>`).join("")}</div>
          <button data-apply-job="${job.id}">Postular</button>
        </article>
      `
    )
    .join("");

  const recommendationList = document.querySelector("#recommendations-list");
  recommendationList.innerHTML = state.recommendations
    .map(
      (job) => `
        <article class="card">
          <div class="job-title">${job.title} - ${job.company} <span class="badge">Score ${job.score}</span></div>
          <div class="meta">${job.location} | ${job.modality} | $${job.salary}</div>
          <div class="small">${job.reasons.join(" | ")}</div>
          <button data-apply-job="${job.id}">Postular</button>
        </article>
      `
    )
    .join("");

  bindApplyButtons();
  renderBoard();
}

function renderBoard() {
  const board = document.querySelector("#board");
  if (!board) return;

  const statuses = ["Postulado", "En revisión", "Entrevista", "Descartado"];

  board.innerHTML = statuses
    .map((status) => {
      const cards = state.applications.filter((entry) => entry.status === status);
      return `
        <section class="column">
          <h3>${status}</h3>
          ${
            cards.length
              ? cards
                  .map(
                    (application) => `
                      <article class="card">
                        <div class="job-title">${application.job?.title || "Vacante"}</div>
                        <div class="meta">${application.job?.company || "-"}</div>
                        <div class="small">Fuente: ${application.source} | ${new Date(
                      application.createdAt
                    ).toLocaleDateString()}</div>
                        <label>Cambiar estado</label>
                        <select data-status-id="${application.id}">
                          ${statuses
                            .map(
                              (stateItem) =>
                                `<option value="${stateItem}" ${
                                  stateItem === application.status ? "selected" : ""
                                }>${stateItem}</option>`
                            )
                            .join("")}
                        </select>
                      </article>
                    `
                  )
                  .join("")
              : "<p class='small'>Sin postulaciones</p>"
          }
        </section>
      `;
    })
    .join("");

  bindStatusSelectors();
}

function bindApplyButtons() {
  document.querySelectorAll("[data-apply-job]").forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        const jobId = Number(button.getAttribute("data-apply-job"));
        await api("/applications", {
          method: "POST",
          body: JSON.stringify({ jobId, source: "manual" })
        });
        await loadApplications();
        setStatus("Postulación registrada correctamente.");
      } catch (error) {
        setStatus(error.message, true);
      }
    });
  });
}

function bindStatusSelectors() {
  document.querySelectorAll("[data-status-id]").forEach((select) => {
    select.addEventListener("change", async () => {
      try {
        const id = select.getAttribute("data-status-id");
        await api(`/applications/${id}/status`, {
          method: "PATCH",
          body: JSON.stringify({ status: select.value })
        });
        await loadApplications();
        setStatus("Estado actualizado.");
      } catch (error) {
        setStatus(error.message, true);
      }
    });
  });
}

function bindEvents() {
  const registerBtn = document.querySelector("#register-btn");
  const loginBtn = document.querySelector("#login-btn");
  const logoutBtn = document.querySelector("#logout-btn");

  registerBtn?.addEventListener("click", async () => {
    try {
      const name = document.querySelector("#register-name").value.trim();
      const email = document.querySelector("#register-email").value.trim();
      const password = document.querySelector("#register-password").value.trim();

      const data = await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password })
      });

      saveSession(data.token, data.user);
      await bootstrapPrivateData();
      setStatus("Usuario registrado y autenticado.");
    } catch (error) {
      setStatus(error.message, true);
    }
  });

  loginBtn?.addEventListener("click", async () => {
    try {
      const email = document.querySelector("#login-email").value.trim();
      const password = document.querySelector("#login-password").value.trim();

      const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      saveSession(data.token, data.user);
      await bootstrapPrivateData();
      setStatus("Sesión iniciada correctamente.");
    } catch (error) {
      setStatus(error.message, true);
    }
  });

  logoutBtn?.addEventListener("click", () => {
    clearSession();
    state.jobs = [];
    state.recommendations = [];
    state.applications = [];
    render();
    setStatus("Sesión cerrada.");
  });

  document.querySelector("#save-profile-btn")?.addEventListener("click", saveProfile);
  document.querySelector("#load-profile-btn")?.addEventListener("click", loadProfile);
  document.querySelector("#load-jobs-btn")?.addEventListener("click", loadJobs);
  document
    .querySelector("#load-recommendations-btn")
    ?.addEventListener("click", loadRecommendations);
  document.querySelector("#load-applications-btn")?.addEventListener("click", loadApplications);

  document.querySelector("#auto-apply-btn")?.addEventListener("click", async () => {
    try {
      const result = await api("/automation/run", {
        method: "POST",
        body: JSON.stringify({ limit: 2, minScore: 55 })
      });
      await loadApplications();
      setStatus(`Autopostulación ejecutada: ${result.totalGenerated} nuevas postulaciones.`);
    } catch (error) {
      setStatus(error.message, true);
    }
  });
}

async function saveProfile() {
  try {
    const payload = {
      skills: document
        .querySelector("#profile-skills")
        .value.split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      yearsExperience: Number(document.querySelector("#profile-years").value || 0),
      expectedSalary: Number(document.querySelector("#profile-salary").value || 0),
      location: document.querySelector("#profile-location").value.trim(),
      modality: document.querySelector("#profile-modality").value,
      summary: document.querySelector("#profile-summary").value.trim()
    };

    state.profile = await api("/profile", {
      method: "PUT",
      body: JSON.stringify(payload)
    });

    setStatus("Perfil actualizado.");
    render();
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function loadProfile() {
  try {
    state.profile = await api("/profile");
    render();
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function loadJobs() {
  try {
    state.jobs = await api("/jobs");
    render();
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function loadRecommendations() {
  try {
    state.recommendations = await api("/recommendations");
    render();
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function loadApplications() {
  try {
    state.applications = await api("/applications");
    render();
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function bootstrapPrivateData() {
  render();
  await Promise.all([loadProfile(), loadJobs(), loadRecommendations(), loadApplications()]);
}

async function init() {
  render();

  if (state.token && state.user) {
    try {
      await bootstrapPrivateData();
      setStatus("Sesión restaurada.");
    } catch (error) {
      clearSession();
      render();
      setStatus("Tu sesión expiró. Inicia sesión nuevamente.", true);
    }
  }
}

init();
