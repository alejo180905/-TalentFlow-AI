# Diagrama de Proceso de Interacción - TalentFlow AI

## Descripción
Este documento muestra los flujos de interacción principales del sistema TalentFlow AI.

---

## 1. Flujo de Registro y Onboarding

```mermaid
sequenceDiagram
    participant C as Candidato
    participant F as Frontend
    participant B as Backend API
    participant DB as PostgreSQL
    participant AI as OpenAI GPT-4
    participant N as Neo4j

    C->>F: Accede a registro
    F->>B: POST /api/auth/register
    B->>DB: Crear usuario
    DB-->>B: Usuario creado
    B-->>F: JWT Token
    F-->>C: Redirige a onboarding

    C->>F: Carga CV (PDF/Word)
    F->>B: POST /api/cv/upload
    B->>AI: Extraer habilidades
    AI-->>B: Skills extraídas
    B->>N: Crear nodos (Candidato)-[:TIENE]->(Skill)
    B->>DB: Guardar perfil
    B-->>F: Perfil actualizado
    F-->>C: Muestra habilidades extraídas

    C->>F: Define expectativas laborales
    F->>B: POST /api/profile/expectations
    B->>DB: Guardar preferencias
    B-->>F: Expectativas guardadas
    F-->>C: Onboarding completado
```

---

## 2. Flujo de Recomendación de Vacantes

```mermaid
sequenceDiagram
    participant C as Candidato
    participant F as Frontend
    participant B as Backend API
    participant N as Neo4j
    participant V as API Vacantes

    C->>F: Accede a vacantes recomendadas
    F->>B: GET /api/recommendations
    B->>V: Obtener vacantes disponibles
    V-->>B: Lista de vacantes
    B->>N: MATCH (c:Candidato)-[:TIENE]->(s:Skill)<-[:REQUIERE]-(v:Vacante)
    N-->>B: Vacantes con score de matching
    B->>B: Calcular score final (skills + expectativas)
    B-->>F: Vacantes ordenadas por score
    F-->>C: Muestra vacantes recomendadas
```

---

## 3. Flujo de Postulación

```mermaid
sequenceDiagram
    participant C as Candidato
    participant F as Frontend
    participant B as Backend API
    participant DB as PostgreSQL
    participant N as Neo4j

    C->>F: Click "Postularme"
    F->>B: POST /api/applications
    B->>DB: Crear postulación (estado: "Postulado")
    B->>N: (Candidato)-[:POSTULO]->(Vacante)
    DB-->>B: Postulación creada
    B-->>F: Confirmación
    F-->>C: Notificación de éxito
    F->>F: Actualizar tablero Kanban
```

---

## 4. Flujo de Autopostulación (Agente IA)

```mermaid
sequenceDiagram
    participant C as Candidato
    participant F as Frontend
    participant B as Backend API
    participant AG as Agente IA
    participant N as Neo4j
    participant DB as PostgreSQL

    C->>F: Activa autopostulación
    F->>B: POST /api/auto-apply/enable
    B->>AG: Iniciar agente

    loop Cada 24 horas
        AG->>N: Buscar vacantes con score > 80%
        N-->>AG: Vacantes candidatas
        AG->>AG: Filtrar por expectativas
        AG->>B: POST /api/applications (batch)
        B->>DB: Crear postulaciones automáticas
        B-->>AG: Confirmación
    end

    AG->>F: Notificación: "3 nuevas postulaciones"
    F-->>C: Muestra notificación
```

---

## 5. Flujo de Seguimiento (Tablero Kanban)

```mermaid
sequenceDiagram
    participant C as Candidato
    participant F as Frontend
    participant B as Backend API
    participant DB as PostgreSQL

    C->>F: Accede al tablero
    F->>B: GET /api/applications
    B->>DB: SELECT * FROM applications WHERE user_id = ?
    DB-->>B: Lista de postulaciones
    B-->>F: Postulaciones con estados
    F->>F: Renderizar columnas Kanban
    F-->>C: Muestra tablero (Postulado | En revisión | Entrevista | Descartado)

    Note over B,DB: Simulación de cambio de estado
    B->>DB: UPDATE application SET status = 'Entrevista'
    B->>F: WebSocket: estado actualizado
    F-->>C: Notificación: "¡Avanzaste a entrevista!"
```

---

## Diagrama de Flujo General

```
┌─────────────────────────────────────────────────────────────────┐
│                        CANDIDATO                                 │
└─────────────────────────────┬───────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  REGISTRO    │───▶│  ONBOARDING  │───▶│   VACANTES   │
│  (Auth JWT)  │    │  (CV + Exp)  │    │   (Match)    │
└──────────────┘    └──────────────┘    └──────────────┘
                                               │
                    ┌──────────────────────────┼──────────────────┐
                    ▼                          ▼                  ▼
           ┌──────────────┐          ┌──────────────┐    ┌──────────────┐
           │  POSTULACIÓN │          │ AUTO-APPLY   │    │   TABLERO    │
           │  (Manual)    │          │ (Agente IA)  │    │   (Kanban)   │
           └──────────────┘          └──────────────┘    └──────────────┘
                    │                          │                  │
                    └──────────────────────────┼──────────────────┘
                                               ▼
                                    ┌──────────────────┐
                                    │  NOTIFICACIONES  │
                                    │  (WebSocket)     │
                                    └──────────────────┘
```

---

## Estados de Postulación

```mermaid
stateDiagram-v2
    [*] --> Postulado
    Postulado --> EnRevisión: Reclutador revisa
    EnRevisión --> Entrevista: Aprobado
    EnRevisión --> Descartado: Rechazado
    Entrevista --> Oferta: Éxito
    Entrevista --> Descartado: No seleccionado
    Oferta --> Contratado: Acepta
    Oferta --> Descartado: Rechaza
    Descartado --> [*]
    Contratado --> [*]
```
