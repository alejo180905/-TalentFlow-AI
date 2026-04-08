// =====================================================
// TalentFlow AI - Neo4j Graph Schema
// Base de datos de grafos para Skills-Roles-Vacantes
// =====================================================

// =====================================================
// CONSTRAINTS (Unicidad)
// =====================================================

// Candidatos únicos por email
CREATE CONSTRAINT candidate_email IF NOT EXISTS
FOR (c:Candidate) REQUIRE c.email IS UNIQUE;

// Skills únicos por nombre normalizado
CREATE CONSTRAINT skill_name IF NOT EXISTS
FOR (s:Skill) REQUIRE s.name IS UNIQUE;

// Roles únicos por nombre
CREATE CONSTRAINT role_name IF NOT EXISTS
FOR (r:Role) REQUIRE r.name IS UNIQUE;

// Vacantes únicas por ID externo
CREATE CONSTRAINT vacancy_external_id IF NOT EXISTS
FOR (v:Vacancy) REQUIRE v.externalId IS UNIQUE;

// Empresas únicas por nombre
CREATE CONSTRAINT company_name IF NOT EXISTS
FOR (c:Company) REQUIRE c.name IS UNIQUE;

// =====================================================
// ÍNDICES para búsquedas rápidas
// =====================================================

CREATE INDEX candidate_id IF NOT EXISTS FOR (c:Candidate) ON (c.userId);
CREATE INDEX skill_category IF NOT EXISTS FOR (s:Skill) ON (s.category);
CREATE INDEX vacancy_active IF NOT EXISTS FOR (v:Vacancy) ON (v.isActive);
CREATE INDEX vacancy_modality IF NOT EXISTS FOR (v:Vacancy) ON (v.workModality);

// =====================================================
// NODOS
// =====================================================

// Ejemplo de nodo Candidate
// CREATE (c:Candidate {
//     userId: 'uuid',
//     email: 'candidato@email.com',
//     fullName: 'Juan Pérez',
//     experienceYears: 5
// })

// Ejemplo de nodo Skill
// CREATE (s:Skill {
//     name: 'javascript',
//     displayName: 'JavaScript',
//     category: 'programming_language',
//     level: 'intermediate'
// })

// Ejemplo de nodo Role
// CREATE (r:Role {
//     name: 'fullstack_developer',
//     displayName: 'Fullstack Developer',
//     seniorityLevel: 'mid'
// })

// Ejemplo de nodo Vacancy
// CREATE (v:Vacancy {
//     externalId: 'uuid',
//     title: 'Senior Fullstack Developer',
//     minSalary: 5000000,
//     maxSalary: 8000000,
//     location: 'Medellín',
//     workModality: 'hybrid',
//     isActive: true
// })

// Ejemplo de nodo Company
// CREATE (c:Company {
//     name: 'Tech Company',
//     industry: 'Technology',
//     location: 'Medellín'
// })

// =====================================================
// RELACIONES
// =====================================================

// Candidato tiene Skills
// (Candidate)-[:HAS_SKILL {level: 'advanced', yearsExperience: 3}]->(Skill)

// Candidato tiene experiencia en Roles
// (Candidate)-[:HAS_EXPERIENCE {years: 2}]->(Role)

// Candidato se postuló a Vacante
// (Candidate)-[:APPLIED_TO {date: datetime(), score: 85.5}]->(Vacancy)

// Vacante requiere Skills
// (Vacancy)-[:REQUIRES_SKILL {importance: 'required'}]->(Skill)
// (Vacancy)-[:REQUIRES_SKILL {importance: 'nice_to_have'}]->(Skill)

// Vacante busca Role
// (Vacancy)-[:SEEKS_ROLE]->(Role)

// Vacante pertenece a Company
// (Vacancy)-[:BELONGS_TO]->(Company)

// Skill está relacionado con otro Skill
// (Skill)-[:RELATED_TO {strength: 0.8}]->(Skill)

// Role requiere Skills
// (Role)-[:TYPICALLY_REQUIRES]->(Skill)

// =====================================================
// QUERIES DE EJEMPLO
// =====================================================

// 1. Encontrar vacantes que coincidan con las skills del candidato
// MATCH (c:Candidate {userId: $userId})-[:HAS_SKILL]->(s:Skill)<-[:REQUIRES_SKILL]-(v:Vacancy)
// WHERE v.isActive = true
// WITH v, COUNT(s) AS matchedSkills, COLLECT(s.name) AS skills
// RETURN v, matchedSkills, skills
// ORDER BY matchedSkills DESC

// 2. Calcular score de compatibilidad
// MATCH (c:Candidate {userId: $userId})-[:HAS_SKILL]->(s:Skill)
// WITH c, COLLECT(s) AS candidateSkills
// MATCH (v:Vacancy)-[:REQUIRES_SKILL]->(rs:Skill)
// WHERE v.isActive = true
// WITH v, candidateSkills, COLLECT(rs) AS requiredSkills
// WITH v,
//      SIZE([s IN requiredSkills WHERE s IN candidateSkills]) AS matched,
//      SIZE(requiredSkills) AS total
// RETURN v,
//        CASE WHEN total > 0 THEN (matched * 100.0 / total) ELSE 0 END AS skillScore
// ORDER BY skillScore DESC

// 3. Encontrar skills relacionadas que el candidato podría aprender
// MATCH (c:Candidate {userId: $userId})-[:HAS_SKILL]->(s:Skill)-[:RELATED_TO]->(related:Skill)
// WHERE NOT (c)-[:HAS_SKILL]->(related)
// RETURN related.name, COUNT(*) AS relevance
// ORDER BY relevance DESC
// LIMIT 10

// =====================================================
// DATOS SEMILLA - Skills Base
// =====================================================

// Programming Languages
CREATE (js:Skill {name: 'javascript', displayName: 'JavaScript', category: 'programming_language'})
CREATE (ts:Skill {name: 'typescript', displayName: 'TypeScript', category: 'programming_language'})
CREATE (py:Skill {name: 'python', displayName: 'Python', category: 'programming_language'})
CREATE (java:Skill {name: 'java', displayName: 'Java', category: 'programming_language'})

// Frameworks
CREATE (react:Skill {name: 'react', displayName: 'React.js', category: 'framework'})
CREATE (node:Skill {name: 'nodejs', displayName: 'Node.js', category: 'framework'})
CREATE (express:Skill {name: 'express', displayName: 'Express.js', category: 'framework'})
CREATE (spring:Skill {name: 'spring', displayName: 'Spring Boot', category: 'framework'})

// Databases
CREATE (pg:Skill {name: 'postgresql', displayName: 'PostgreSQL', category: 'database'})
CREATE (mongo:Skill {name: 'mongodb', displayName: 'MongoDB', category: 'database'})
CREATE (neo:Skill {name: 'neo4j', displayName: 'Neo4j', category: 'database'})

// Soft Skills
CREATE (leadership:Skill {name: 'leadership', displayName: 'Liderazgo', category: 'soft_skill'})
CREATE (communication:Skill {name: 'communication', displayName: 'Comunicación', category: 'soft_skill'})
CREATE (teamwork:Skill {name: 'teamwork', displayName: 'Trabajo en equipo', category: 'soft_skill'})

// Relacionar skills
CREATE (js)-[:RELATED_TO {strength: 0.9}]->(ts)
CREATE (js)-[:RELATED_TO {strength: 0.8}]->(react)
CREATE (js)-[:RELATED_TO {strength: 0.8}]->(node)
CREATE (node)-[:RELATED_TO {strength: 0.9}]->(express)
CREATE (java)-[:RELATED_TO {strength: 0.9}]->(spring)

// Roles
CREATE (fullstack:Role {name: 'fullstack_developer', displayName: 'Fullstack Developer'})
CREATE (frontend:Role {name: 'frontend_developer', displayName: 'Frontend Developer'})
CREATE (backend:Role {name: 'backend_developer', displayName: 'Backend Developer'})
CREATE (data:Role {name: 'data_engineer', displayName: 'Data Engineer'})

// Roles requieren skills
CREATE (fullstack)-[:TYPICALLY_REQUIRES]->(js)
CREATE (fullstack)-[:TYPICALLY_REQUIRES]->(react)
CREATE (fullstack)-[:TYPICALLY_REQUIRES]->(node)
CREATE (fullstack)-[:TYPICALLY_REQUIRES]->(pg)
CREATE (frontend)-[:TYPICALLY_REQUIRES]->(js)
CREATE (frontend)-[:TYPICALLY_REQUIRES]->(react)
CREATE (backend)-[:TYPICALLY_REQUIRES]->(node)
CREATE (backend)-[:TYPICALLY_REQUIRES]->(pg)
CREATE (data)-[:TYPICALLY_REQUIRES]->(py)
CREATE (data)-[:TYPICALLY_REQUIRES]->(pg);
