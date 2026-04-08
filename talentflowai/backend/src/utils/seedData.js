/**
 * Seed Data - Vacantes de ejemplo
 */

require('dotenv').config();
const { Pool } = require('pg');
const neo4j = require('neo4j-driver');

const pool = new Pool({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    database: process.env.POSTGRES_DB || 'talentflow',
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD
});

// Vacantes de ejemplo
const vacancies = [
    {
        title: 'Senior Fullstack Developer',
        company: 'TechCorp Colombia',
        description: 'Buscamos desarrollador fullstack con experiencia en React y Node.js',
        location: 'Medellín',
        workModality: 'hybrid',
        minSalary: 8000000,
        maxSalary: 12000000,
        currency: 'COP',
        requiredSkills: ['javascript', 'react', 'nodejs', 'postgresql'],
        experienceYears: 4
    },
    {
        title: 'Backend Developer Python',
        company: 'DataTech',
        description: 'Desarrollador backend para proyectos de análisis de datos',
        location: 'Bogotá',
        workModality: 'remote',
        minSalary: 6000000,
        maxSalary: 9000000,
        currency: 'COP',
        requiredSkills: ['python', 'django', 'postgresql', 'docker'],
        experienceYears: 3
    },
    {
        title: 'Frontend Developer React',
        company: 'StartupAI',
        description: 'Frontend developer para plataforma de IA',
        location: 'Medellín',
        workModality: 'remote',
        minSalary: 5000000,
        maxSalary: 8000000,
        currency: 'COP',
        requiredSkills: ['javascript', 'react', 'typescript', 'css'],
        experienceYears: 2
    },
    {
        title: 'DevOps Engineer',
        company: 'CloudServices',
        description: 'Ingeniero DevOps para infraestructura cloud',
        location: 'Cali',
        workModality: 'hybrid',
        minSalary: 10000000,
        maxSalary: 15000000,
        currency: 'COP',
        requiredSkills: ['aws', 'docker', 'kubernetes', 'terraform', 'jenkins'],
        experienceYears: 4
    },
    {
        title: 'Data Engineer',
        company: 'AnalyticsPro',
        description: 'Data engineer para pipelines de datos',
        location: 'Bogotá',
        workModality: 'onsite',
        minSalary: 7000000,
        maxSalary: 11000000,
        currency: 'COP',
        requiredSkills: ['python', 'sql', 'aws', 'spark'],
        experienceYears: 3
    },
    {
        title: 'Mobile Developer Flutter',
        company: 'AppMakers',
        description: 'Desarrollador mobile con Flutter',
        location: 'Barranquilla',
        workModality: 'remote',
        minSalary: 5500000,
        maxSalary: 8500000,
        currency: 'COP',
        requiredSkills: ['flutter', 'dart', 'firebase'],
        experienceYears: 2
    },
    {
        title: 'Java Developer Senior',
        company: 'EnterpriseSoft',
        description: 'Desarrollador Java para aplicaciones empresariales',
        location: 'Medellín',
        workModality: 'hybrid',
        minSalary: 9000000,
        maxSalary: 14000000,
        currency: 'COP',
        requiredSkills: ['java', 'spring', 'microservices', 'postgresql'],
        experienceYears: 5
    },
    {
        title: 'Tech Lead',
        company: 'InnovateTech',
        description: 'Líder técnico para equipo de desarrollo',
        location: 'Bogotá',
        workModality: 'hybrid',
        minSalary: 15000000,
        maxSalary: 22000000,
        currency: 'COP',
        requiredSkills: ['javascript', 'nodejs', 'leadership', 'architecture'],
        experienceYears: 7
    },
    {
        title: 'QA Automation Engineer',
        company: 'QualitySoft',
        description: 'Ingeniero QA para automatización de pruebas',
        location: 'Medellín',
        workModality: 'remote',
        minSalary: 5000000,
        maxSalary: 7500000,
        currency: 'COP',
        requiredSkills: ['selenium', 'javascript', 'cypress', 'api_testing'],
        experienceYears: 2
    },
    {
        title: 'Cloud Architect',
        company: 'CloudNative',
        description: 'Arquitecto cloud para soluciones AWS/Azure',
        location: 'Bogotá',
        workModality: 'remote',
        minSalary: 18000000,
        maxSalary: 28000000,
        currency: 'COP',
        requiredSkills: ['aws', 'azure', 'architecture', 'kubernetes', 'terraform'],
        experienceYears: 8
    }
];

async function seedPostgres() {
    console.log('🌱 Iniciando seed de PostgreSQL...');

    for (const vacancy of vacancies) {
        try {
            await pool.query(`
                INSERT INTO vacancies
                    (title, company, description, location, work_modality,
                     min_salary, max_salary, currency, required_skills, experience_years)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                ON CONFLICT DO NOTHING
            `, [
                vacancy.title,
                vacancy.company,
                vacancy.description,
                vacancy.location,
                vacancy.workModality,
                vacancy.minSalary,
                vacancy.maxSalary,
                vacancy.currency,
                vacancy.requiredSkills,
                vacancy.experienceYears
            ]);
            console.log(`  ✅ ${vacancy.title} @ ${vacancy.company}`);
        } catch (error) {
            console.error(`  ❌ Error: ${vacancy.title}`, error.message);
        }
    }
}

async function seedNeo4j() {
    console.log('🌱 Iniciando seed de Neo4j...');

    const driver = neo4j.driver(
        process.env.NEO4J_URI || 'bolt://localhost:7687',
        neo4j.auth.basic(
            process.env.NEO4J_USER || 'neo4j',
            process.env.NEO4J_PASSWORD || 'password'
        )
    );

    const session = driver.session();

    try {
        // Crear skills base
        const skills = [
            { name: 'javascript', displayName: 'JavaScript', category: 'programming_language' },
            { name: 'typescript', displayName: 'TypeScript', category: 'programming_language' },
            { name: 'python', displayName: 'Python', category: 'programming_language' },
            { name: 'java', displayName: 'Java', category: 'programming_language' },
            { name: 'react', displayName: 'React.js', category: 'framework' },
            { name: 'nodejs', displayName: 'Node.js', category: 'framework' },
            { name: 'django', displayName: 'Django', category: 'framework' },
            { name: 'spring', displayName: 'Spring Boot', category: 'framework' },
            { name: 'postgresql', displayName: 'PostgreSQL', category: 'database' },
            { name: 'mongodb', displayName: 'MongoDB', category: 'database' },
            { name: 'aws', displayName: 'AWS', category: 'cloud' },
            { name: 'docker', displayName: 'Docker', category: 'devops' },
            { name: 'kubernetes', displayName: 'Kubernetes', category: 'devops' },
            { name: 'leadership', displayName: 'Liderazgo', category: 'soft_skill' }
        ];

        for (const skill of skills) {
            await session.run(`
                MERGE (s:Skill {name: $name})
                ON CREATE SET s.displayName = $displayName, s.category = $category
            `, skill);
        }
        console.log('  ✅ Skills creadas');

        // Crear vacantes en Neo4j
        for (const vacancy of vacancies) {
            const externalId = `${vacancy.company}-${vacancy.title}`.toLowerCase().replace(/\s+/g, '-');

            await session.run(`
                MERGE (v:Vacancy {externalId: $externalId})
                ON CREATE SET
                    v.title = $title,
                    v.company = $company,
                    v.location = $location,
                    v.workModality = $workModality,
                    v.minSalary = $minSalary,
                    v.maxSalary = $maxSalary,
                    v.isActive = true
            `, {
                externalId,
                title: vacancy.title,
                company: vacancy.company,
                location: vacancy.location,
                workModality: vacancy.workModality,
                minSalary: vacancy.minSalary,
                maxSalary: vacancy.maxSalary
            });

            // Relacionar con skills
            for (const skillName of vacancy.requiredSkills) {
                await session.run(`
                    MATCH (v:Vacancy {externalId: $externalId})
                    MATCH (s:Skill {name: $skillName})
                    MERGE (v)-[:REQUIRES_SKILL]->(s)
                `, { externalId, skillName });
            }
        }
        console.log('  ✅ Vacantes y relaciones creadas');

    } finally {
        await session.close();
        await driver.close();
    }
}

async function main() {
    console.log('\n🚀 TalentFlow AI - Seed Data\n');

    try {
        await seedPostgres();
        console.log('\n');
        await seedNeo4j();
        console.log('\n✅ Seed completado exitosamente\n');
    } catch (error) {
        console.error('\n❌ Error durante el seed:', error);
    } finally {
        await pool.end();
    }
}

main();
