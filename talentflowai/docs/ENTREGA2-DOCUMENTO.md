# TalentFlow AI - Documento de Entrega 2

**Proyecto:** TalentFlow AI - Sistema Inteligente de Matching Laboral  
**Equipo:** [Nombres del equipo]  
**Fecha:** Abril 2026  
**Curso:** [Nombre del curso]  

---

## 1. Problema y Solución

### 1.1 Problema Identificado

La búsqueda de empleo tradicional presenta múltiples fricciones tanto para candidatos como para empresas:

| Problema | Impacto |
|----------|---------|
| **Búsqueda manual exhaustiva** | Los candidatos invierten 10+ horas semanales navegando portales sin resultados relevantes |
| **Desajuste de perfiles** | 75% de las postulaciones no cumplen requisitos mínimos (frustración para ambas partes) |
| **Falta de retroalimentación** | Los candidatos desconocen por qué fueron rechazados o qué mejorar |
| **Información dispersa** | Skills, experiencia y expectativas no están estructuradas para matching efectivo |
| **Procesos manuales** | Las empresas revisan CVs manualmente, proceso lento y sesgado |

### 1.2 Solución Propuesta

**TalentFlow AI** es una plataforma de matching inteligente que utiliza:

1. **Inteligencia Artificial (GPT)** para extraer automáticamente habilidades de CVs
2. **Base de datos de grafos (Neo4j)** para modelar relaciones Skills ↔ Roles ↔ Vacantes
3. **Algoritmo de compatibilidad ponderado** que considera:
   - Match de habilidades (40%)
   - Expectativa salarial (25%)
   - Ubicación/modalidad (20%)
   - Experiencia requerida (15%)

### 1.3 Propuesta de Valor

| Para Candidatos | Para Empresas |
|-----------------|---------------|
| Recomendaciones personalizadas | Candidatos pre-filtrados por compatibilidad |
| Autopostulación inteligente | Reducción de tiempo de screening |
| Tablero Kanban de seguimiento | Mejor calidad de postulaciones |
| Feedback de compatibilidad | Análisis basado en grafos de skills |

### 1.4 Equipo

| Rol | Nombre | Responsabilidades |
|-----|--------|-------------------|
| Product Owner | [Nombre] | Visión del producto, priorización |
| Desarrollador Backend | [Nombre] | API REST, Neo4j, PostgreSQL |
| Desarrollador Frontend | [Nombre] | Interfaz SPA, UX/UI |
| QA / DevOps | [Nombre] | Testing, deployment |

---

## 2. Características de la Aplicación

### 2.1 Requerimientos Funcionales (RF)

| ID | Requerimiento | Prioridad | Estado |
|----|---------------|-----------|--------|
| RF01 | **Registro y autenticación de usuarios** - El sistema permite registro con email/contraseña y autenticación mediante JWT | Alta | ✅ Implementado |
| RF02 | **Carga y procesamiento de CV** - El usuario puede subir CV en PDF/DOCX y el sistema extrae habilidades automáticamente usando IA | Alta | ✅ Implementado |
| RF03 | **Gestión de perfil y expectativas** - El usuario puede configurar expectativas salariales, modalidad de trabajo preferida y ubicaciones | Alta | ✅ Implementado |
| RF04 | **Visualización de vacantes** - El sistema muestra listado de vacantes con filtros por modalidad, ubicación y búsqueda | Alta | ✅ Implementado |
| RF05 | **Motor de recomendaciones** - El sistema calcula compatibilidad candidato-vacante usando Neo4j y presenta matches ordenados por score | Alta | ✅ Implementado |
| RF06 | **Postulación a vacantes** - El usuario puede postularse a vacantes con un clic, registrando el score de compatibilidad | Alta | ✅ Implementado |
| RF07 | **Tablero Kanban de postulaciones** - El usuario visualiza sus postulaciones organizadas por estado (postulado, en revisión, entrevista, oferta, descartado) | Media | ✅ Implementado |
| RF08 | **Autopostulación inteligente** - Opción para que el sistema postule automáticamente a vacantes con score > 80% | Media | ✅ Implementado |
| RF09 | **Desglose de compatibilidad** - El usuario puede ver el detalle de cómo se calculó su score para cada vacante | Baja | ✅ Implementado |

### 2.2 Requerimientos No Funcionales (RNF)

| ID | Requerimiento | Métrica/Criterio | Estado |
|----|---------------|------------------|--------|
| RNF01 | **Rendimiento** | Tiempo de respuesta < 2 segundos para búsquedas | ✅ Implementado |
| RNF02 | **Seguridad** | Contraseñas hasheadas con bcrypt, tokens JWT con expiración | ✅ Implementado |
| RNF03 | **Escalabilidad** | Arquitectura modular que permite escalar horizontalmente | ✅ Diseñado |
| RNF04 | **Usabilidad** | Interfaz responsive, funcional en móviles y desktop | ✅ Implementado |
| RNF05 | **Disponibilidad** | Sistema disponible 99% del tiempo con manejo de errores | ✅ Implementado |
| RNF06 | **Mantenibilidad** | Código organizado en capas (MVC), documentado | ✅ Implementado |
| RNF07 | **Compatibilidad** | Funciona en Chrome, Firefox, Safari, Edge modernos | ✅ Implementado |

---

## 3. Arquitectura y Tecnologías

### 3.1 Diagrama de Arquitectura (C4 - Nivel 1: Contexto)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           SISTEMA TALENTFLOW AI                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│    ┌──────────┐         ┌─────────────────────────────────────────┐     │
│    │          │         │           TALENTFLOW AI                  │     │
│    │ CANDIDATO│◄───────►│                                         │     │
│    │          │  HTTP   │  ┌─────────┐    ┌─────────────────┐    │     │
│    └──────────┘         │  │ Frontend│◄──►│ Backend (API)   │    │     │
│                         │  │  (SPA)  │    │   Node.js       │    │     │
│                         │  └─────────┘    └────────┬────────┘    │     │
│                         │                          │              │     │
│                         │           ┌──────────────┼──────────┐  │     │
│                         │           ▼              ▼          ▼  │     │
│                         │    ┌──────────┐  ┌──────────┐ ┌──────┐│     │
│                         │    │PostgreSQL│  │  Neo4j   │ │OpenAI││     │
│                         │    │ (Datos)  │  │ (Grafos) │ │ GPT  ││     │
│                         │    └──────────┘  └──────────┘ └──────┘│     │
│                         └─────────────────────────────────────────┘     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Stack Tecnológico

| Capa | Tecnología | Versión | Justificación |
|------|------------|---------|---------------|
| **Frontend** | HTML5, CSS3, JavaScript ES6+ | - | SPA ligera sin frameworks, fácil mantenimiento |
| **Backend** | Node.js + Express.js | 20.x LTS / 4.18.x | Ecosistema amplio, async/await, JSON nativo |
| **BD Relacional** | PostgreSQL | 15.x | ACID compliance, soporte JSON, robustez |
| **BD Grafos** | Neo4j AuraDB | 5.x | Modelado natural de relaciones Skills↔Roles↔Vacantes |
| **IA/LLM** | OpenAI GPT-3.5/4 | API | Extracción inteligente de habilidades de CVs |
| **Autenticación** | JWT + bcrypt | - | Stateless, seguro, escalable |
| **Procesamiento CVs** | pdf-parse, mammoth | - | Extracción de texto de PDF y DOCX |

### 3.3 Modelo de Datos

#### PostgreSQL (Datos transaccionales)

```sql
-- Tablas principales
users (id, email, password_hash, full_name, phone, location, cv_url, skills, auto_apply_enabled)
user_expectations (user_id, min_salary, max_salary, work_modality, preferred_locations)
vacancies (id, external_id, title, company, description, location, work_modality, min_salary, max_salary, required_skills)
applications (id, user_id, vacancy_id, status, compatibility_score, applied_at)
application_history (id, application_id, previous_status, new_status, changed_at)
notifications (id, user_id, type, title, message, read, created_at)
```

#### Neo4j (Grafo de relaciones)

```
(:Candidate)-[:HAS_SKILL]->(:Skill)
(:Skill)-[:REQUIRED_FOR]->(:Role)
(:Role)-[:MATCHES]->(:Vacancy)
(:Vacancy)-[:POSTED_BY]->(:Company)
(:Vacancy)-[:REQUIRES]->(:Skill)
```

### 3.4 Diagrama de Secuencia - Flujo de Recomendaciones

```
Candidato          Frontend           Backend            Neo4j           PostgreSQL
    │                  │                  │                 │                  │
    │──Ver Recomend.──►│                  │                 │                  │
    │                  │──GET /recommend──►│                 │                  │
    │                  │                  │──Query skills───►│                  │
    │                  │                  │◄──Graph match────│                  │
    │                  │                  │──Get vacancies───────────────────►│
    │                  │                  │◄──Vacancy data────────────────────│
    │                  │                  │                 │                  │
    │                  │                  │ [Calcular scores ponderados]       │
    │                  │                  │                 │                  │
    │                  │◄─Recomendaciones─│                 │                  │
    │◄─Mostrar cards───│                  │                 │                  │
```

---

## 4. MVP - Producto Mínimo Viable

### 4.1 Funcionalidades del MVP

El MVP incluye las siguientes funcionalidades core:

1. ✅ Autenticación (registro/login)
2. ✅ Carga de CV con extracción de skills por IA
3. ✅ Configuración de perfil y expectativas
4. ✅ Visualización de vacantes con filtros
5. ✅ Motor de recomendaciones con scoring
6. ✅ Postulación a vacantes
7. ✅ Tablero Kanban de seguimiento

### 4.2 Screenshots del MVP

> **IMPORTANTE:** Reemplazar las descripciones con capturas de pantalla reales de la aplicación funcionando.

---

#### 4.2.1 Página Principal (Home)

**[INSERTAR SCREENSHOT: home.png]**

*Descripción: Landing page con hero section, propuesta de valor y features principales. Incluye navegación y botones de registro/login.*

- URL: `http://localhost:5500/` o abrir `index.html`
- Componentes visibles: Header con navegación, Hero con CTA, Cards de features

---

#### 4.2.2 Modal de Registro

**[INSERTAR SCREENSHOT: registro.png]**

*Descripción: Formulario de registro con campos nombre completo, email y contraseña.*

- Acción: Click en "Registrarse" en el header
- Campos: Nombre completo, Email, Contraseña

---

#### 4.2.3 Modal de Login

**[INSERTAR SCREENSHOT: login.png]**

*Descripción: Formulario de inicio de sesión con email y contraseña.*

- Acción: Click en "Iniciar Sesión" en el header
- Autenticación: JWT token almacenado en localStorage

---

#### 4.2.4 Listado de Vacantes

**[INSERTAR SCREENSHOT: vacantes.png]**

*Descripción: Grid de tarjetas de vacantes con información de empresa, ubicación, modalidad, skills requeridos y rango salarial. Incluye filtros de búsqueda.*

- URL: Navegar a "Vacantes"
- Filtros: Búsqueda por texto, filtro por modalidad, filtro por ubicación
- Cards: Título, empresa, ubicación, modalidad, skills tags, salario, botón postular

---

#### 4.2.5 Recomendaciones Personalizadas

**[INSERTAR SCREENSHOT: recomendaciones.png]**

*Descripción: Vacantes recomendadas ordenadas por score de compatibilidad. Cada card muestra el porcentaje de match calculado por el algoritmo.*

- URL: Navegar a "Recomendaciones"
- Badge de score: Porcentaje de compatibilidad (ej: "92% Match")
- Ordenamiento: Mayor a menor compatibilidad

---

#### 4.2.6 Tablero Kanban de Postulaciones

**[INSERTAR SCREENSHOT: kanban.png]**

*Descripción: Tablero estilo Kanban con 5 columnas representando el estado de las postulaciones: Postulado, En Revisión, Entrevista, Oferta, Descartado.*

- URL: Navegar a "Mis Postulaciones"
- Columnas: postulado → en_revision → entrevista → oferta / descartado
- Cards: Nombre de vacante, empresa, score de compatibilidad

---

#### 4.2.7 Perfil de Usuario

**[INSERTAR SCREENSHOT: perfil.png]**

*Descripción: Página de perfil con formulario de datos personales, carga de CV, visualización de skills extraídas y configuración de expectativas laborales.*

- URL: Navegar a "Mi Perfil"
- Secciones:
  - Datos personales (nombre, email, teléfono, ubicación)
  - CV Upload (arrastra o selecciona archivo)
  - Skills extraídas (tags de habilidades)
  - Expectativas (salario min/max, modalidad, ubicaciones)
  - Toggle de autopostulación

---

#### 4.2.8 Skills Extraídas del CV

**[INSERTAR SCREENSHOT: skills.png]**

*Descripción: Visualización de habilidades extraídas automáticamente del CV usando OpenAI GPT. Muestra tags con las tecnologías y competencias identificadas.*

- Proceso: Subir CV → Sistema usa GPT para extraer skills → Se muestran como tags
- Ejemplo: JavaScript, React, Node.js, PostgreSQL, Git, etc.

---

#### 4.2.9 Notificación de Postulación Exitosa

**[INSERTAR SCREENSHOT: toast-postulacion.png]**

*Descripción: Toast notification confirmando que la postulación fue enviada exitosamente.*

- Trigger: Click en "Postularme" en cualquier vacante
- Mensaje: "¡Postulación enviada exitosamente!"

---

### 4.3 Cómo Ejecutar el MVP

#### Requisitos previos
- Node.js 20.x LTS
- PostgreSQL 15.x
- Cuenta Neo4j AuraDB (o Neo4j Desktop)
- API Key de OpenAI

#### Pasos de instalación

```bash
# 1. Clonar/descargar el proyecto
cd talentflowai

# 2. Configurar variables de entorno
cp backend/.env.example backend/.env
# Editar .env con credenciales reales

# 3. Instalar dependencias del backend
cd backend
npm install

# 4. Ejecutar migraciones de PostgreSQL
psql -U postgres -d talentflow -f ../database/schema.sql

# 5. Ejecutar schema de Neo4j
# Copiar contenido de ../database/neo4j-schema.cypher en Neo4j Browser

# 6. Iniciar el backend
npm start
# Servidor corriendo en http://localhost:3000

# 7. Abrir frontend
# Abrir frontend/index.html en el navegador
# O usar Live Server de VS Code
```

#### Credenciales de prueba (si aplica)
```
Email: demo@talentflow.ai
Password: demo123
```

---

## 5. Conclusiones y Trabajo Futuro

### 5.1 Logros de esta Entrega

- ✅ Arquitectura completa con 2 bases de datos (relacional + grafos)
- ✅ Integración de IA para extracción de skills
- ✅ Motor de recomendaciones funcional
- ✅ Interfaz completa con todas las vistas
- ✅ Documentación técnica (diagramas C4, secuencia)

### 5.2 Trabajo Futuro (Backlog)

| Feature | Prioridad | Descripción |
|---------|-----------|-------------|
| Integración APIs externas | Alta | Conectar con Indeed, CompuTrabajo para importar vacantes reales |
| Notificaciones push | Media | Alertas en tiempo real de nuevos matches |
| Dashboard analytics | Media | Métricas de postulaciones, conversion rates |
| Mobile app | Baja | App nativa iOS/Android |
| Chatbot asistente | Baja | Asistente IA para guiar al candidato |

---

## 6. Referencias

- Neo4j Documentation: https://neo4j.com/docs/
- OpenAI API: https://platform.openai.com/docs/
- Express.js: https://expressjs.com/
- PostgreSQL: https://www.postgresql.org/docs/

---

**Documento preparado por:** [Equipo TalentFlow AI]  
**Versión:** 2.0  
**Última actualización:** Abril 2026
