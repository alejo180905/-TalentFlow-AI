# 🎤 TalentFlow AI — Presentación Sustentación Magneto
**Equipo:** Alejandro Correa Marín · Juan José Palacio Z  
**Fecha:** Abril 2026

> **Cómo usar este documento:** Cada sección es una diapositiva. El texto en *cursiva* son notas para el expositor (no se proyectan). Las tablas y diagramas sí van en la pantalla.

---

## DIAPOSITIVA 1 — PORTADA

```
╔══════════════════════════════════════════════╗
║                                              ║
║          🤖 TalentFlow AI                   ║
║                                              ║
║   Matching Inteligente Candidato–Vacante     ║
║                                              ║
║   Alejandro Correa Marín                    ║
║   Juan José Palacio Z                       ║
║                                              ║
║   Abril 2026 · Sustentación Entrega 2       ║
╚══════════════════════════════════════════════╝
```

*Notas: Saludo, presentarse por nombre, mencionar que es el MVP de la Entrega 2.*

---

## DIAPOSITIVA 2 — AGENDA

### ¿Qué vamos a ver hoy?

1. 🔴 El Problema
2. 💡 Nuestra Solución
3. 👥 El Equipo
4. ⚙️ Características (RF y RNF)
5. 🏗️ Arquitectura y Tecnologías
6. 🖥️ Demo en vivo
7. 📈 Próximos pasos

*Notas: Presentar la agenda brevemente. La presentación completa dura aproximadamente 15–20 minutos.*

---

## DIAPOSITIVA 3 — EL PROBLEMA

### ¿Por qué es difícil encontrar trabajo hoy?

| 🔴 Problema | 💥 Impacto Real |
|-------------|----------------|
| Búsqueda manual y exhaustiva | +10 horas semanales navegando portales sin resultados útiles |
| Desajuste de perfiles | 75% de las postulaciones no cumplen requisitos mínimos |
| Sin retroalimentación | El candidato no sabe por qué fue rechazado ni qué mejorar |
| Información dispersa | Habilidades, experiencia y expectativas no están estructuradas |
| Revisión manual de CVs | Proceso lento, costoso y propenso a sesgos humanos |

> **"El problema no es la falta de empleos — es la falta de conexión eficiente entre talento y oportunidad."**

*Notas: Énfasis en los dos actores afectados: candidatos (pierden tiempo) y empresas (pierden calidad de candidatos). Preguntar al público si alguna vez vivió esto.*

---

## DIAPOSITIVA 4 — LA SOLUCIÓN

### TalentFlow AI: Matching Inteligente

```
   📄 CV del candidato
         │
         ▼
   🤖 IA extrae skills
         │
         ▼
   🕸️ Neo4j cruza skills ↔ vacantes
         │
         ▼
   📊 Score de compatibilidad
         │
         ▼
   🎯 Recomendaciones personalizadas
```

**4 pilares del sistema:**
1. **IA (GPT-3.5/4)** → extrae automáticamente habilidades del CV
2. **Base de datos de grafos (Neo4j)** → modela relaciones Skills ↔ Roles ↔ Vacantes
3. **Algoritmo ponderado** → score calculado con 4 factores
4. **Automatización** → el sistema puede postular por el candidato (score > 80%)

*Notas: Mostrar el flujo con la mano en el diagrama. Destacar que la novedad está en el grafo de skills + la extracción con IA.*

---

## DIAPOSITIVA 5 — PROPUESTA DE VALOR

### ¿Qué gana cada parte?

| 👤 Para el Candidato | 🏢 Para la Empresa |
|----------------------|--------------------|
| ✅ Recomendaciones personalizadas por perfil | ✅ Candidatos ya filtrados por compatibilidad |
| ✅ Sube CV una vez, el sistema hace el resto | ✅ Menor tiempo de screening |
| ✅ Ve exactamente por qué es compatible | ✅ Mejor calidad de postulaciones recibidas |
| ✅ Tablero Kanban para seguir cada proceso | ✅ Análisis de talento basado en grafos |
| ✅ Autopostulación inteligente activable | ✅ Reducción de sesgo en selección inicial |

*Notas: Hacer énfasis en la diferencia vs. LinkedIn/CompuTrabajo: allá busca el candidato; acá el sistema trabaja por él.*

---

## DIAPOSITIVA 6 — EL EQUIPO

### Quiénes somos

| Rol | Nombre | Responsabilidad principal |
|-----|--------|--------------------------|
| 🎯 **Product Owner** | Alejandro Correa Marín | Visión del producto, priorización del backlog, arquitectura |
| 🔧 **Desarrollador Full Stack** | Juan José Palacio Z | API REST, Neo4j, PostgreSQL, Frontend SPA |

**Herramientas de gestión:**
- 📋 Azure DevOps → Backlog y Sprint Board
- 🐙 GitHub → Control de versiones
- 🗣️ SCRUM → Sprints de 2 semanas, daily/weekly, planning con Poker

*Notas: Mencionar brevemente las ceremonias SCRUM que han hecho. Si tienen screenshots de Azure, mostrarlos aquí.*

---

## DIAPOSITIVA 7 — CARACTERÍSTICAS: REQUISITOS FUNCIONALES

### ¿Qué puede hacer el sistema? (RF)

| ID | Funcionalidad | Estado |
|----|--------------|--------|
| RF01 | 🔐 Registro e inicio de sesión (JWT) | ✅ Implementado |
| RF02 | 📄 Carga de CV (PDF/Word) + extracción de skills con IA | ✅ Implementado |
| RF03 | 👤 Gestión de perfil y expectativas laborales | ✅ Implementado |
| RF04 | 🔍 Visualización de vacantes con filtros | ✅ Implementado |
| RF05 | 🎯 Motor de recomendaciones con score de compatibilidad | ✅ Implementado |
| RF06 | 📨 Postulación a vacantes con un clic | ✅ Implementado |
| RF07 | 📊 Tablero Kanban de seguimiento de postulaciones | ✅ Implementado |
| RF08 | 🤖 Autopostulación inteligente (score > 80%) | ✅ Implementado |
| RF09 | 🔎 Desglose detallado del score de compatibilidad | ✅ Implementado |

> **9 de 9 requerimientos funcionales del MVP implementados**

*Notas: Para cada RF, tener listo en el demo una pantalla que lo evidencie. RF01–RF04 son el onboarding, RF05–RF09 son el core del sistema.*

---

## DIAPOSITIVA 8 — CARACTERÍSTICAS: REQUISITOS NO FUNCIONALES

### ¿Cómo se comporta el sistema? (RNF)

| ID | Calidad | Criterio de Éxito | Cómo se cumple |
|----|---------|-------------------|---------------|
| RNF01 | ⚡ Rendimiento | Respuesta < 2 seg | Índices en PostgreSQL + Neo4j, queries optimizadas |
| RNF02 | 🔒 Seguridad | Datos protegidos | bcrypt (salt 12) + JWT + helmet.js |
| RNF03 | 📈 Escalabilidad | Crecimiento sin degradación | Arquitectura modular, separación de capas |
| RNF04 | 📱 Usabilidad | Responsive en móvil y desktop | CSS Grid/Flexbox, diseño adaptativo |
| RNF05 | 🟢 Disponibilidad | 99% uptime | Error handler global, fallbacks en IA y Neo4j |
| RNF06 | 🛠️ Mantenibilidad | Código organizado | Patrón MVC, capas separadas, documentado |
| RNF07 | 🌐 Compatibilidad | Chrome, Firefox, Safari, Edge | HTML5/CSS3 estándar, sin dependencias propietarias |

*Notas: Destacar RNF02 (seguridad): las contraseñas NUNCA se guardan en texto plano. Destacar RNF05: si OpenAI falla, el sistema sigue funcionando con extracción básica.*

---

## DIAPOSITIVA 9 — ARQUITECTURA: VISTA GENERAL

### Stack completo del sistema

```
┌─────────────────────────────────────────────────────────┐
│                    CANDIDATO (Browser)                   │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTPS
                        ▼
┌─────────────────────────────────────────────────────────┐
│              FRONTEND (SPA)                              │
│  HTML5 · CSS3 · JavaScript ES6+                          │
│  Sin framework — ligero y portable                       │
└───────────────────────┬─────────────────────────────────┘
                        │ REST API (JSON)
                        ▼
┌─────────────────────────────────────────────────────────┐
│              BACKEND API — Node.js + Express             │
│  Autenticación JWT · Validación · Lógica de negocio      │
│  Procesamiento de CV · Motor de Recomendación            │
└──────┬──────────────┬──────────────────┬────────────────┘
       │              │                  │
       ▼              ▼                  ▼
┌──────────┐   ┌──────────┐      ┌──────────────┐
│PostgreSQL│   │  Neo4j   │      │  OpenAI GPT  │
│  15.x    │   │ AuraDB   │      │  3.5 / 4     │
│          │   │  5.x     │      │              │
│ Usuarios │   │ Skills ↔ │      │ Extracción   │
│ Vacantes │   │ Roles ↔  │      │ de skills    │
│ Postulac.│   │ Vacantes │      │ del CV       │
└──────────┘   └──────────┘      └──────────────┘
```

*Notas: Explicar por qué DOS bases de datos: PostgreSQL para datos transaccionales (ACID) y Neo4j para el grafo de relaciones. Estas son tecnologías que Magneto usa en su stack real.*

---

## DIAPOSITIVA 10 — ARQUITECTURA: ESTILOS Y PATRONES

### Decisiones arquitectónicas

| Estilo | Aplicación en TalentFlow AI |
|--------|----------------------------|
| **Client/Server** | Frontend SPA ↔ Backend API REST sobre HTTP |
| **Layered (N-Tiers)** | Presentación → Lógica de negocio → Datos (3 capas) |
| **MVC** | Controllers / Models / Routes en el backend |
| **Component-Based** | Frontend dividido en componentes reutilizables |
| **SOA (micro-servicios ligero)** | Servicios independientes: CV Service, Recommendation Service |

**Lenguajes y frameworks:**

| Capa | Tecnología | Versión | Justificación |
|------|-----------|---------|--------------|
| Frontend | HTML5 + CSS3 + JS ES6+ | — | SPA ligera, sin overhead de frameworks |
| Backend | Node.js + Express.js | 20.x / 4.18 | Async nativo, JSON, ecosistema NPM |
| BD Relacional | PostgreSQL | 15.x | ACID, soporte arrays, UUID, triggers |
| BD Grafos | Neo4j AuraDB | 5.x | Relaciones Skills↔Roles naturales en grafo |
| IA / LLM | OpenAI API | GPT-3.5/4 | Extracción semántica de habilidades |
| Auth | JWT + bcrypt | — | Stateless, seguro, estándar de industria |

*Notas: Mencionar que Neo4j es una tecnología que usan plataformas como LinkedIn para modelar relaciones profesionales. Es una elección avanzada para el nivel del curso.*

---

## DIAPOSITIVA 11 — MODELO DE DATOS: POSTGRESQL

### Datos transaccionales (PostgreSQL)

```sql
users           → id, email, password_hash, full_name, location, cv_url
user_expectations → user_id, min_salary, max_salary, work_modality, locations
vacancies       → id, title, company, required_skills[], min_salary, max_salary
applications    → id, user_id, vacancy_id, status, compatibility_score
application_history → cambios de estado automáticos (via trigger)
notifications   → notificaciones simuladas por usuario
```

**Características del schema:**
- 🔑 UUIDs como primary keys (seguridad y distribución)
- 🔗 Foreign keys con CASCADE
- ⚡ Índices en campos de búsqueda frecuente
- 🤖 Triggers automáticos para `updated_at` e historial de estados

*Notas: Los triggers son un elemento avanzado — demuestran conocimiento de bases de datos más allá del CRUD básico.*

---

## DIAPOSITIVA 12 — MODELO DE DATOS: NEO4J (GRAFO)

### Relaciones de habilidades (Neo4j)

```
(:Candidate)-[:HAS_SKILL {level: 'advanced'}]->(:Skill)
(:Skill)-[:RELATED_TO {strength: 0.9}]->(:Skill)
(:Vacancy)-[:REQUIRES_SKILL {importance: 'required'}]->(:Skill)
(:Role)-[:TYPICALLY_REQUIRES]->(:Skill)
(:Vacancy)-[:SEEKS_ROLE]->(:Role)
(:Candidate)-[:APPLIED_TO {score: 85.5}]->(:Vacancy)
```

**¿Por qué grafos?**
- Un candidato con "React" también coincide con roles que piden "JavaScript" (skills relacionadas)
- Se puede recomendar skills que el candidato debería aprender
- Las consultas de matching son naturales y eficientes en grafo vs. SQL joins complejos

**Query de recomendación en Cypher:**
```cypher
MATCH (c:Candidate {userId: $id})-[:HAS_SKILL]->(s:Skill)
WITH c, COLLECT(s) AS mySkills
MATCH (v:Vacancy)-[:REQUIRES_SKILL]->(rs:Skill)
WITH v, mySkills,
     SIZE([s IN COLLECT(rs) WHERE s IN mySkills]) AS matched,
     SIZE(COLLECT(rs)) AS total
RETURN v, (matched * 100.0 / total) AS skillScore
ORDER BY skillScore DESC
```

*Notas: Si el público es técnico, explicar la ventaja de Cypher vs SQL para este tipo de consulta. Si no, enfocarse en el resultado: "encuentra los trabajos más compatibles con mis habilidades".*

---

## DIAPOSITIVA 13 — ALGORITMO DE RECOMENDACIÓN

### ¿Cómo se calcula el score de compatibilidad?

```
SCORE FINAL = Skills(50%) + Salario(25%) + Modalidad(15%) + Ubicación(10%)
```

| Factor | Peso | Cálculo |
|--------|------|---------|
| 🧠 Match de skills | 50% | (skills que coinciden / skills requeridas) × 100 |
| 💰 Expectativa salarial | 25% | ¿El salario ofrecido ≥ expectativa mínima? |
| 🏠 Modalidad (remoto/híbrido/presencial) | 15% | Coincidencia exacta = 100, distinta = 30 |
| 📍 Ubicación | 10% | ¿Está en las ubicaciones preferidas? |

**Ejemplo:**
> Candidato: JavaScript, React, Node.js | Salario esperado: $6M | Modalidad: Remoto | Ciudad: Medellín
>
> Vacante "Senior Fullstack" (JavaScript, React, Node.js, PostgreSQL): 3/4 skills = 75% × 0.50 = 37.5 + salario OK(25) + modalidad OK(15) + ubicación OK(10) = **87.5% de compatibilidad**

*Notas: Mostrar el desglose en la demo. El candidato puede ver exactamente por qué una vacante tiene ese score.*

---

## DIAPOSITIVA 14 — FLUJO PRINCIPAL DEL SISTEMA

### Onboarding → Recomendación → Postulación

```
[1] REGISTRO          [2] ONBOARDING           [3] RECOMENDACIÓN
Candidato crea  →  Sube CV (PDF/DOCX)  →  Sistema calcula scores
cuenta con JWT     GPT extrae skills       y recomienda vacantes
                   Se guardan en Neo4j

[4] POSTULACIÓN       [5] SEGUIMIENTO
Candidato postula  →  Tablero Kanban:
con 1 clic            Postulado → Revisión
Score registrado      → Entrevista → Oferta
                      Historial completo
```

**Automatización disponible:**
- Activar "autopostulación" → el sistema postula automáticamente a todas las vacantes con score > 80%

*Notas: Este es el flujo que demostrarán en el demo. Seguirlo paso a paso.*

---

## DIAPOSITIVA 15 — ESTRUCTURA DEL CÓDIGO

### Árbol de directorios del proyecto

```
talentflowai/
├── backend/
│   ├── app.js                    ← Punto de entrada, middlewares
│   ├── src/
│   │   ├── controllers/          ← Lógica de cada endpoint
│   │   │   ├── auth.controller.js
│   │   │   ├── profile.controller.js
│   │   │   ├── recommendation.controller.js
│   │   │   ├── application.controller.js
│   │   │   └── vacancy.controller.js
│   │   ├── models/
│   │   │   └── User.model.js     ← Acceso a PostgreSQL
│   │   ├── routes/               ← Definición de endpoints REST
│   │   ├── services/
│   │   │   ├── cv.service.js     ← OpenAI + extracción básica
│   │   │   └── recommendationService.js ← Algoritmo de scoring
│   │   └── utils/
│   │       ├── database.js       ← Pool de conexiones PostgreSQL
│   │       ├── neo4j.js          ← Driver Neo4j + queries Cypher
│   │       └── authMiddleware.js ← Validación JWT
├── frontend/
│   ├── index.html                ← SPA única página
│   └── src/
│       ├── pages/app.js          ← Lógica UI, navegación, modales
│       ├── services/             ← Llamadas a la API REST
│       └── styles/               ← CSS responsive
└── database/
    ├── schema.sql                ← Schema PostgreSQL con triggers
    └── neo4j-schema.cypher       ← Constraints, índices, seed data
```

*Notas: Destacar la separación clara de responsabilidades. El patrón MVC es visible en la estructura.*

---

## DIAPOSITIVA 16 — SEGURIDAD IMPLEMENTADA

### ¿Cómo protegemos los datos?

| Capa | Medida de Seguridad | Implementación |
|------|---------------------|---------------|
| Contraseñas | Hash + Salt | `bcrypt` con factor 12 |
| Sesiones | Token sin estado | JWT con expiración (7 días) |
| API | Headers de seguridad | `helmet.js` (XSS, CSRF, etc.) |
| CORS | Origen controlado | Solo permite `localhost:5500` (configurable) |
| Validación | Input sanitization | `express-validator` en todos los endpoints |
| BD | Prepared statements | `pg` con `$1, $2...` (previene SQL injection) |
| Errores | Sin exposición interna | Stack trace solo en modo `development` |

*Notas: Magneto trabaja con datos sensibles de candidatos. Mostrar que entienden la importancia de la seguridad.*

---

## DIAPOSITIVA 17 — DEMO EN VIVO

### Flujo a demostrar

> **Abrir el navegador con la aplicación corriendo**

**Secuencia de demo (5–7 minutos):**

1. **Registro** → crear cuenta nueva (nombre, email, contraseña)
2. **Subir CV** → cargar un PDF → ver las skills extraídas por IA
3. **Configurar expectativas** → salario, modalidad remoto, ciudad Medellín
4. **Ver vacantes** → listado con filtros
5. **Ver recomendaciones** → vacantes ordenadas por % de compatibilidad
6. **Ver desglose** → explicar por qué una vacante tiene 87% de match
7. **Postularse** → con un clic, ver confirmación
8. **Tablero Kanban** → ver la postulación en columna "Postulado"

*Notas: Si hay problemas con la conexión a BD, usar los datos mock que están configurados en el frontend como fallback automático. La aplicación funciona offline gracias al mock.*

---

## DIAPOSITIVA 18 — AVANCE DE IMPLEMENTACIÓN

### ¿Cuánto llevamos construido?

```
Funcionalidades Core:
████████████████████ 100% — Autenticación (registro/login/JWT)
████████████████████ 100% — Carga y procesamiento de CV
████████████████████ 100% — Gestión de perfil y expectativas
████████████████████ 100% — Visualización de vacantes con filtros
████████████████████ 100% — Motor de recomendaciones (Neo4j + scoring)
████████████████████ 100% — Postulación a vacantes
████████████████████ 100% — Tablero Kanban de seguimiento
████████████████████ 100% — Autopostulación inteligente
██████████████░░░░░░  70% — Notificaciones en tiempo real
░░░░░░░░░░░░░░░░░░░░   0% — Integración con APIs externas (fase 2)

MVP Total: ~85% implementado
```

**Justificación del porcentaje:**
- ✅ Todo el core del MVP está funcional
- ✅ Backend + Frontend + 2 bases de datos + IA integrados
- ⏳ Notificaciones WebSocket en progreso
- 📅 Integración APIs externas (Indeed/CompuTrabajo) está en el backlog fase 2

*Notas: Ser honesto con el porcentaje. ~85% es defendible porque todo el flujo principal funciona end-to-end.*

---

## DIAPOSITIVA 19 — LECCIONES APRENDIDAS

### Lo que aprendimos en este Sprint

**✅ Lo que funcionó bien:**
- La elección de Neo4j para el matching fue acertada — las queries Cypher son más naturales para relaciones que SQL
- El fallback a extracción básica de skills asegura que la app funcione sin API key de OpenAI
- Separar los datos transaccionales (PostgreSQL) de las relaciones (Neo4j) simplificó el código

**⚠️ Lo que mejoraríamos:**
- Establecer convención de nombres desde el inicio (encontramos archivos duplicados `auth.controller.js` vs `authController.js`)
- Documentar los pesos del algoritmo en un solo lugar (estaban duplicados con valores diferentes)
- Configurar CI/CD desde el sprint 1 para evitar integración manual

**📚 Nuevas tecnologías aprendidas:**
- Cypher (lenguaje de consulta de Neo4j)
- Extracción de texto de PDFs con `pdf-parse`
- Integración con OpenAI API y diseño de prompts efectivos

---

## DIAPOSITIVA 20 — PRÓXIMOS PASOS

### ¿Qué viene en el Sprint 3?

| Feature | Prioridad | Justificación |
|---------|-----------|--------------|
| 🔔 Notificaciones push en tiempo real (WebSocket) | 🔴 Alta | Completa la experiencia de seguimiento |
| 🌐 Integración con Indeed/CompuTrabajo API | 🔴 Alta | Vacantes reales vs mock data |
| 📊 Dashboard de analytics | 🟡 Media | Métricas de postulaciones y conversión |
| 🧹 Limpieza de código (eliminar duplicados) | 🔴 Alta | Deuda técnica identificada |
| 🧪 Tests automatizados (Jest + Supertest) | 🟡 Media | Cobertura del backend |
| 📱 PWA (Progressive Web App) | 🟢 Baja | Experiencia móvil mejorada |

*Notas: Mostrar que tienen visión de producto más allá del MVP. El roadmap demuestra madurez de equipo.*

---

## DIAPOSITIVA 21 — CIERRE

```
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   TalentFlow AI es más que un proyecto académico.       ║
║                                                          ║
║   Es una respuesta real a un problema real:             ║
║   conectar talento con oportunidad de manera            ║
║   inteligente, eficiente y sin sesgos.                  ║
║                                                          ║
║   Repositorio: github.com/alejo180905/-TalentFlow-AI   ║
║                                                          ║
║   👤 Alejandro Correa Marín                            ║
║   👤 Juan José Palacio Z                               ║
║                                                          ║
║              ¿Preguntas?                                ║
╚══════════════════════════════════════════════════════════╝
```

*Notas: Agradecer al jurado/Magneto. Invitar a hacer preguntas técnicas o de producto. Tener lista la demo por si piden verla de nuevo.*

---

## 📋 CHECKLIST PRE-PRESENTACIÓN

Verificar antes de entrar a sustentar:

- [ ] Backend corriendo: `cd talentflowai/backend && npm start`
- [ ] Frontend abierto en el navegador (index.html o Live Server)
- [ ] Credenciales de prueba listas: `demo@talentflow.ai / demo123`
- [ ] CV de prueba en PDF listo para subir durante el demo
- [ ] Neo4j AuraDB activo (o modo fallback confirmado)
- [ ] PostgreSQL con datos seed cargados
- [ ] Pantalla de presentación en modo presentador
- [ ] Silenciar notificaciones del celular y computador
- [ ] Tener el link del repositorio visible

---

## 🎯 PREGUNTAS FRECUENTES (Preparar respuestas)

**Q: ¿Por qué usan dos bases de datos?**
> PostgreSQL guarda los datos transaccionales (usuarios, postulaciones, vacantes) donde necesitamos ACID y consistencia. Neo4j guarda las relaciones entre skills, roles y vacantes donde lo valioso son los grafos de conexión, no los registros individuales. Ambas se complementan.

**Q: ¿Funciona la extracción de skills sin pagar OpenAI?**
> Sí. Implementamos un fallback con un diccionario local de más de 40 tecnologías y soft skills. Si la API de OpenAI no está disponible, el sistema extrae skills por coincidencia de texto. Es menos preciso pero siempre funcional.

**Q: ¿Cómo escalaría el sistema con 1 millón de usuarios?**
> La arquitectura está preparada: PostgreSQL soporta read replicas, Neo4j AuraDB escala horizontalmente, y el backend stateless (JWT) permite múltiples instancias detrás de un load balancer. El siguiente paso sería containerizar con Docker y orquestar con Kubernetes.

**Q: ¿Por qué no usaron React/Angular para el frontend?**
> Decidimos priorizar la funcionalidad core (backend + IA + grafos) en este sprint. Una SPA vanilla en JS ES6+ cumple todos los requisitos funcionales y tiene menos overhead. En el sprint 3 podríamos migrar a React.

**Q: ¿Cuánto cuesta el sistema por mes en producción?**
> Neo4j AuraDB Free: $0 (hasta 200K nodos). PostgreSQL (Railway/Supabase Free tier): $0. OpenAI API: ~$5-20 según uso. Hosting backend (Railway/Render Free): $0. **MVP: ~$5-20/mes.**
