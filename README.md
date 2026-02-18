# TalentFlow AI

## Descripción del Proyecto

**TalentFlow AI** es un sistema inteligente diseñado para optimizar el proceso de búsqueda de empleo y el matching entre candidatos y vacantes. Este MVP tiene como objetivo demostrar cómo la tecnología puede mejorar la velocidad, calidad y automatización en los procesos de selección de personal, reduciendo el tiempo y esfuerzo tanto para los candidatos como para los reclutadores.

El sistema permite a los usuarios (candidatos) cargar su CV, extraer automáticamente habilidades y experiencia, y personalizar su perfil. Además, los candidatos pueden establecer sus expectativas laborales (salario, modalidad, ubicación) y recibir recomendaciones de vacantes relevantes basadas en un motor de matching. El sistema también permite simular postulaciones automáticas, registrar el historial de postulaciones y realizar un seguimiento del estado de cada proceso de selección a través de un tablero visual.

---

## Requisitos Funcionales

1. **Registro e inicio de sesión**:
   - Los candidatos deben poder registrarse en la plataforma con su correo electrónico y una contraseña segura.
   - El sistema debe permitir iniciar sesión con autenticación mediante JWT.

2. **Carga de CV**:
   - Los candidatos deben poder cargar su CV en formato PDF o Word.
   - El sistema debe procesar el CV y extraer habilidades y experiencia automáticamente.

3. **Edición de perfil**:
   - Los candidatos deben poder editar manualmente su perfil, incluyendo habilidades, experiencia y datos personales.

4. **Captura de expectativas laborales**:
   - Los candidatos deben poder definir sus expectativas laborales (salario, modalidad de trabajo, ubicación).

5. **Consumo de vacantes**:
   - El sistema debe consumir un conjunto de vacantes desde un mock API o dataset.

6. **Visualización de vacantes**:
   - Los candidatos deben poder ver un listado de vacantes con información relevante (título, empresa, habilidades requeridas, salario, ubicación).

7. **Motor de recomendación**:
   - El sistema debe recomendar vacantes relevantes basándose en las habilidades del candidato y sus expectativas laborales.

8. **Cálculo de score de compatibilidad**:
   - El motor de recomendación debe calcular un score de compatibilidad para cada vacante.

9. **Simulación de postulación**:
   - Los candidatos deben poder simular una postulación a una vacante con un solo clic.

10. **Registro de historial de postulaciones**:
    - El sistema debe registrar todas las postulaciones realizadas por el candidato, incluyendo la fecha y el estado.

11. **Tablero de seguimiento**:
    - Los candidatos deben poder visualizar un tablero con el estado de sus postulaciones (Postulado, En revisión, Entrevista, Descartado).

12. **Notificaciones simuladas**:
    - El sistema debe simular notificaciones de cambios de estado en las postulaciones.

---

## Requisitos No Funcionales

1. **Seguridad**:
   - El sistema debe garantizar la seguridad de los datos personales y laborales de los candidatos mediante encriptación y buenas prácticas de seguridad.

2. **Escalabilidad**:
   - La plataforma debe ser capaz de manejar un número creciente de usuarios y vacantes sin afectar el rendimiento.

3. **Disponibilidad**:
   - El sistema debe estar disponible al menos el 99.9% del tiempo para garantizar una experiencia de usuario confiable.

4. **Compatibilidad**:
   - La plataforma debe ser accesible desde dispositivos móviles y de escritorio, con un diseño responsivo y compatible con los principales navegadores.

---

## Historias de Usuario (HU)

### HU1: Registro de Usuario
**Como** candidato
**Quiero** registrarme en la plataforma
**Para** poder crear mi perfil y recibir recomendaciones de vacantes.

**Criterios de Aceptación:**
- El sistema debe validar que el email no esté registrado.
- La contraseña debe ser almacenada de forma segura (hash).

### HU2: Inicio de Sesión
**Como** candidato
**Quiero** iniciar sesión en la plataforma
**Para** acceder a mi perfil y ver las vacantes recomendadas.

**Criterios de Aceptación:**
- El sistema debe validar las credenciales del usuario.
- El sistema debe generar un token JWT para la sesión.

### HU3: Carga de CV
**Como** candidato
**Quiero** cargar mi CV en la plataforma
**Para** que el sistema extraiga automáticamente mis habilidades y experiencia.

**Criterios de Aceptación:**
- El sistema debe aceptar formatos PDF y Word.
- El sistema debe extraer habilidades y experiencia relevantes.

### HU4: Edición de Perfil
**Como** candidato
**Quiero** editar manualmente mi perfil
**Para** asegurarme de que mi información esté actualizada y sea precisa.

**Criterios de Aceptación:**
- El sistema debe permitir editar habilidades, experiencia y datos personales.
- Los cambios deben ser guardados en la base de datos.

### HU5: Captura de Expectativas Laborales
**Como** candidato
**Quiero** definir mis expectativas laborales
**Para** recibir recomendaciones de vacantes que se ajusten a mis necesidades.

**Criterios de Aceptación:**
- El sistema debe permitir capturar salario deseado, modalidad de trabajo y ubicación.
- Las expectativas deben ser almacenadas en la base de datos.

### HU6: Visualización de Vacantes
**Como** candidato
**Quiero** ver un listado de vacantes
**Para** explorar las oportunidades laborales disponibles.

**Criterios de Aceptación:**
- El sistema debe mostrar un listado de vacantes con información relevante.
- El usuario debe poder filtrar las vacantes por ubicación, salario y modalidad.

### HU7: Motor de Recomendación
**Como** candidato
**Quiero** recibir recomendaciones de vacantes
**Para** postularme a las más relevantes según mi perfil y expectativas laborales.

**Criterios de Aceptación:**
- El sistema debe mostrar un listado de vacantes ordenadas por score.
- El score debe ser calculado según las habilidades y preferencias laborales.

### HU8: Simulación de Postulación
**Como** candidato
**Quiero** simular una postulación a una vacante
**Para** registrar mi interés en la oportunidad laboral.

**Criterios de Aceptación:**
- El sistema debe registrar la postulación en la base de datos.
- El estado inicial de la postulación debe ser "Postulado".

### HU9: Registro de Historial de Postulaciones
**Como** candidato
**Quiero** ver un historial de mis postulaciones
**Para** llevar un seguimiento de mis actividades en la plataforma.

**Criterios de Aceptación:**
- El sistema debe mostrar un listado de todas las postulaciones realizadas.
- Cada postulación debe incluir la fecha y el estado actual.

### HU10: Tablero de Seguimiento
**Como** candidato
**Quiero** ver un tablero con el estado de mis postulaciones
**Para** saber en qué etapa se encuentra cada proceso de selección.

**Criterios de Aceptación:**
- El tablero debe mostrar las postulaciones en diferentes columnas según su estado.
- El usuario debe poder ver detalles de cada postulación.

### HU11: Notificaciones Simuladas
**Como** candidato
**Quiero** recibir notificaciones de cambios de estado en mis postulaciones
**Para** estar informado sobre el progreso de mis procesos de selección.

**Criterios de Aceptación:**
- El sistema debe simular notificaciones en tiempo real.
- Las notificaciones deben incluir el nuevo estado de la postulación.

### HU12: Mecanismo de Automatización
**Como** candidato
**Quiero** activar un agente de autopostulación
**Para** que el sistema postule automáticamente a vacantes relevantes.

**Criterios de Aceptación:**
- El sistema debe permitir activar/desactivar la autopostulación.
- Las postulaciones automáticas deben registrarse en el historial.

---

## Enunciado del Reto

El objetivo de este proyecto es diseñar e implementar un MVP técnico de un sistema llamado **Profile Manager** que permita construir un perfil completo, recomendar vacantes relevantes y automatizar tareas operativas para mejorar la velocidad y calidad del proceso de selección de talento.

### Objetivos mínimos (MVP)
- **Perfil y preferencias**: Capturar CV y expectativas laborales mediante un flujo guiado.
- **Vacantes**: Consumir un conjunto de vacantes (simulado o recolectado) y mostrarlas al candidato.
- **Recomendación**: Proponer vacantes con un criterio defendible (reglas, scoring, semántica o híbrido).
- **Acciones**: Simular autopostulación o postulación asistida, con registro de actividades.
- **Trazabilidad**: Tablero simple de estados (postulado, en revisión, entrevista, descartado) y próximos pasos.

### Alcance recomendado
Para evitar un crecimiento descontrolado del proyecto, se recomienda limitar el alcance inicial a:
- Un flujo de onboarding completo (CV + expectativas laborales).
- Un pipeline de vacantes (mock API / dataset / scraping controlado).
- Un motor de recomendación (baseline con mejoras opcionales).
- Un tablero de proceso con notificaciones simuladas.
- Un mecanismo de automatización (agente IA, workflow o extensión) como demostración.

### Cómo este proyecto aborda el reto
El proyecto **TalentFlow AI** cumple con los objetivos del reto de la siguiente manera:

1. **Perfil y preferencias**:
   - Implementación de un flujo guiado para capturar el CV y las expectativas laborales de los candidatos.

2. **Vacantes**:
   - Consumo de un conjunto de vacantes simuladas o recolectadas mediante una API mock o dataset.

3. **Recomendación**:
   - Motor de recomendación basado en un sistema de scoring o reglas, con posibilidad de mejoras futuras mediante técnicas híbridas o semánticas.

4. **Acciones**:
   - Simulación de autopostulación o postulación asistida, con registro detallado de las actividades realizadas por el candidato.

5. **Trazabilidad**:
   - Desarrollo de un tablero simple que muestra los estados del proceso de selección (postulado, en revisión, entrevista, descartado) y los próximos pasos.

6. **Automatización**:
   - Implementación de un mecanismo de automatización como demostración, utilizando un agente de IA, un flujo de trabajo automatizado o una extensión.

Con este enfoque, **TalentFlow AI** busca ofrecer una solución integral y eficiente para la gestión del talento humano, cumpliendo con los requisitos del reto planteado.

## Estructura Inicial del Proyecto

```
talentflowai/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── tests/
│   ├── app.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   ├── tests/
│   ├── index.html
│   └── package.json
│
├── database/
│   ├── migrations/
│   ├── seeders/
│   └── schema.sql
│
├── docs/
│   ├── architecture-diagram.png
│   ├── user-stories.md
│   └── recommendation-engine.md
│
└── README.md
```