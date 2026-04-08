/**
 * Conexión a Neo4j
 */

const neo4j = require('neo4j-driver');

let driver = null;

/**
 * Conectar a Neo4j
 */
async function connectNeo4j() {
    try {
        driver = neo4j.driver(
            process.env.NEO4J_URI || 'bolt://localhost:7687',
            neo4j.auth.basic(
                process.env.NEO4J_USER || 'neo4j',
                process.env.NEO4J_PASSWORD || 'password'
            ),
            {
                maxConnectionLifetime: 3 * 60 * 60 * 1000, // 3 hours
                maxConnectionPoolSize: 50,
                connectionAcquisitionTimeout: 2 * 60 * 1000, // 2 minutes
            }
        );

        // Verify connectivity
        await driver.verifyConnectivity();
        console.log('🔗 Neo4j: Conexión establecida');
        return true;
    } catch (error) {
        console.error('❌ Neo4j: Error de conexión', error.message);
        throw error;
    }
}

/**
 * Obtener una sesión de Neo4j
 */
function getSession(database = 'neo4j') {
    if (!driver) {
        throw new Error('Neo4j driver no inicializado. Llama a connectNeo4j() primero.');
    }
    return driver.session({ database });
}

/**
 * Ejecutar una query en Neo4j
 */
async function runQuery(cypher, params = {}) {
    const session = getSession();
    try {
        const result = await session.run(cypher, params);
        return result.records;
    } finally {
        await session.close();
    }
}

/**
 * Crear nodo de candidato
 */
async function createCandidateNode(userId, email, fullName) {
    const cypher = `
        MERGE (c:Candidate {userId: $userId})
        ON CREATE SET
            c.email = $email,
            c.fullName = $fullName,
            c.createdAt = datetime()
        ON MATCH SET
            c.email = $email,
            c.fullName = $fullName,
            c.updatedAt = datetime()
        RETURN c
    `;
    return await runQuery(cypher, { userId, email, fullName });
}

/**
 * Agregar skills a un candidato
 */
async function addSkillsToCandidate(userId, skills) {
    const session = getSession();
    try {
        for (const skill of skills) {
            await session.run(`
                MATCH (c:Candidate {userId: $userId})
                MERGE (s:Skill {name: $skillName})
                ON CREATE SET s.displayName = $displayName, s.category = $category
                MERGE (c)-[r:HAS_SKILL]->(s)
                SET r.level = $level, r.updatedAt = datetime()
            `, {
                userId,
                skillName: skill.name.toLowerCase(),
                displayName: skill.displayName || skill.name,
                category: skill.category || 'general',
                level: skill.level || 'intermediate'
            });
        }
    } finally {
        await session.close();
    }
}

/**
 * Obtener vacantes recomendadas para un candidato
 */
async function getRecommendedVacancies(userId, limit = 20) {
    const cypher = `
        MATCH (c:Candidate {userId: $userId})-[:HAS_SKILL]->(s:Skill)
        WITH c, COLLECT(s) AS candidateSkills

        MATCH (v:Vacancy)-[:REQUIRES_SKILL]->(rs:Skill)
        WHERE v.isActive = true
        WITH v, candidateSkills, COLLECT(rs) AS requiredSkills

        WITH v,
             candidateSkills,
             requiredSkills,
             SIZE([s IN requiredSkills WHERE s IN candidateSkills]) AS matchedSkills,
             SIZE(requiredSkills) AS totalRequired

        WHERE matchedSkills > 0

        RETURN v {
            .externalId,
            .title,
            .company,
            .location,
            .workModality,
            .minSalary,
            .maxSalary,
            skillScore: CASE WHEN totalRequired > 0
                THEN ROUND((matchedSkills * 100.0 / totalRequired), 2)
                ELSE 0
            END,
            matchedSkills: matchedSkills,
            totalRequired: totalRequired,
            skills: [s IN requiredSkills | s.name]
        } AS vacancy
        ORDER BY vacancy.skillScore DESC
        LIMIT $limit
    `;

    return await runQuery(cypher, { userId, limit: neo4j.int(limit) });
}

/**
 * Cerrar conexión
 */
async function closeNeo4j() {
    if (driver) {
        await driver.close();
        console.log('🔗 Neo4j: Conexión cerrada');
    }
}

module.exports = {
    connectNeo4j,
    getSession,
    runQuery,
    createCandidateNode,
    addSkillsToCandidate,
    getRecommendedVacancies,
    closeNeo4j
};
