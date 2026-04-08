# Diagrama de Contexto - TalentFlow AI

## Descripción
El diagrama de contexto muestra la interacción entre TalentFlow AI y los actores externos del sistema.

## Diagrama de Contexto (C4 - Nivel 1)

```mermaid
C4Context
    title Diagrama de Contexto - TalentFlow AI

    Person(candidato, "Candidato", "Usuario que busca empleo y gestiona su perfil profesional")

    System(talentflow, "TalentFlow AI", "Sistema inteligente de matching entre candidatos y vacantes con motor de recomendación")

    System_Ext(llm, "OpenAI GPT-4", "Servicio de IA para extracción de habilidades del CV")
    System_Ext(neo4j, "Neo4j AuraDB", "Base de datos de grafos para relaciones skills-roles-vacantes")
    System_Ext(vacantes_api, "API de Vacantes", "Mock API / Dataset de vacantes laborales")
    System_Ext(email, "Servicio de Email", "Notificaciones simuladas")

    Rel(candidato, talentflow, "Usa", "HTTPS")
    Rel(talentflow, llm, "Extrae habilidades", "API REST")
    Rel(talentflow, neo4j, "Consulta matching", "Bolt Protocol")
    Rel(talentflow, vacantes_api, "Consume vacantes", "REST API")
    Rel(talentflow, email, "Envía notificaciones", "SMTP")
```

## Diagrama Simplificado

```
                    ┌─────────────────┐
                    │    Candidato    │
                    │   (Usuario)     │
                    └────────┬────────┘
                             │
                             │ HTTPS
                             ▼
    ┌────────────────────────────────────────────────┐
    │              TalentFlow AI                      │
    │  ┌──────────────────────────────────────────┐  │
    │  │ • Gestión de perfiles                    │  │
    │  │ • Carga y análisis de CV                 │  │
    │  │ • Motor de recomendación                 │  │
    │  │ • Tablero de postulaciones               │  │
    │  │ • Autopostulación                        │  │
    │  └──────────────────────────────────────────┘  │
    └─────────┬──────────┬──────────┬───────────────┘
              │          │          │
              ▼          ▼          ▼
    ┌─────────────┐ ┌─────────┐ ┌──────────────┐
    │ OpenAI GPT  │ │ Neo4j   │ │ API Vacantes │
    │ (Extracción │ │ (Grafos │ │ (Dataset     │
    │  de skills) │ │ Skills) │ │  Mock)       │
    └─────────────┘ └─────────┘ └──────────────┘
```

## Actores y Sistemas

| Elemento | Tipo | Descripción |
|----------|------|-------------|
| Candidato | Actor Principal | Usuario final que busca empleo |
| TalentFlow AI | Sistema Principal | Plataforma de matching candidato-vacante |
| OpenAI GPT-4 | Sistema Externo | IA para procesamiento de lenguaje natural |
| Neo4j AuraDB | Sistema Externo | Base de datos de grafos para relaciones |
| API Vacantes | Sistema Externo | Fuente de datos de vacantes laborales |
| Servicio Email | Sistema Externo | Sistema de notificaciones |

## Flujos Principales

1. **Registro y Perfil**: Candidato → TalentFlow AI
2. **Análisis de CV**: TalentFlow AI → OpenAI GPT-4 → TalentFlow AI
3. **Matching**: TalentFlow AI → Neo4j → TalentFlow AI
4. **Vacantes**: TalentFlow AI → API Vacantes → TalentFlow AI
5. **Notificaciones**: TalentFlow AI → Candidato
