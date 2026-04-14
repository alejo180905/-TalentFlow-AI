/**
 * CV Service - Extracción de habilidades con OpenAI
 */

const OpenAI = require('openai');

// Inicialización lazy de OpenAI (solo si hay API key)
let openai = null;
function getOpenAI() {
    if (!openai && process.env.OPENAI_API_KEY) {
        openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }
    return openai;
}

const cvService = {
    /**
     * Extraer habilidades del texto del CV usando GPT
     */
    async extractSkills(cvText) {
        // Si no hay API key, usar extracción básica
        if (!process.env.OPENAI_API_KEY) {
            console.warn('⚠️ OPENAI_API_KEY no configurada, usando extracción básica');
            return this.extractSkillsBasic(cvText);
        }

        try {
            const client = getOpenAI();
            const response = await client.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `Eres un experto en recursos humanos y tecnología.
                        Analiza el siguiente CV y extrae todas las habilidades técnicas y blandas.
                        Responde SOLO con un JSON array en el siguiente formato:
                        [
                            {"name": "javascript", "displayName": "JavaScript", "category": "programming_language", "level": "advanced"},
                            {"name": "leadership", "displayName": "Liderazgo", "category": "soft_skill", "level": "intermediate"}
                        ]

                        Categorías válidas: programming_language, framework, database, cloud, devops, soft_skill, tool, methodology
                        Niveles válidos: beginner, intermediate, advanced, expert

                        Infiere el nivel basándote en años de experiencia mencionados o contexto.
                        Extrae TODAS las habilidades que identifiques, incluyendo las implícitas.`
                    },
                    {
                        role: 'user',
                        content: cvText.substring(0, 8000) // Limitar tokens
                    }
                ],
                temperature: 0.3,
                max_tokens: 2000
            });

            const content = response.choices[0].message.content;

            // Parsear JSON de la respuesta
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                const skills = JSON.parse(jsonMatch[0]);
                return skills;
            }

            return this.extractSkillsBasic(cvText);
        } catch (error) {
            console.error('Error con OpenAI:', error.message);
            return this.extractSkillsBasic(cvText);
        }
    },

    /**
     * Extracción básica de habilidades (fallback)
     */
    extractSkillsBasic(cvText) {
        const text = cvText.toLowerCase();
        const foundSkills = [];

        // Lista de skills conocidas
        const skillsDatabase = {
            // Programming Languages
            'javascript': { displayName: 'JavaScript', category: 'programming_language' },
            'typescript': { displayName: 'TypeScript', category: 'programming_language' },
            'python': { displayName: 'Python', category: 'programming_language' },
            'java': { displayName: 'Java', category: 'programming_language' },
            'c#': { displayName: 'C#', category: 'programming_language' },
            'c++': { displayName: 'C++', category: 'programming_language' },
            'php': { displayName: 'PHP', category: 'programming_language' },
            'ruby': { displayName: 'Ruby', category: 'programming_language' },
            'go': { displayName: 'Go', category: 'programming_language' },
            'rust': { displayName: 'Rust', category: 'programming_language' },
            'swift': { displayName: 'Swift', category: 'programming_language' },
            'kotlin': { displayName: 'Kotlin', category: 'programming_language' },

            // Frameworks
            'react': { displayName: 'React.js', category: 'framework' },
            'angular': { displayName: 'Angular', category: 'framework' },
            'vue': { displayName: 'Vue.js', category: 'framework' },
            'node': { displayName: 'Node.js', category: 'framework' },
            'express': { displayName: 'Express.js', category: 'framework' },
            'django': { displayName: 'Django', category: 'framework' },
            'flask': { displayName: 'Flask', category: 'framework' },
            'spring': { displayName: 'Spring Boot', category: 'framework' },
            'laravel': { displayName: 'Laravel', category: 'framework' },
            '.net': { displayName: '.NET', category: 'framework' },
            'nextjs': { displayName: 'Next.js', category: 'framework' },
            'nestjs': { displayName: 'NestJS', category: 'framework' },

            // Databases
            'mysql': { displayName: 'MySQL', category: 'database' },
            'postgresql': { displayName: 'PostgreSQL', category: 'database' },
            'mongodb': { displayName: 'MongoDB', category: 'database' },
            'redis': { displayName: 'Redis', category: 'database' },
            'neo4j': { displayName: 'Neo4j', category: 'database' },
            'sql server': { displayName: 'SQL Server', category: 'database' },
            'oracle': { displayName: 'Oracle', category: 'database' },
            'dynamodb': { displayName: 'DynamoDB', category: 'database' },

            // Cloud & DevOps
            'aws': { displayName: 'AWS', category: 'cloud' },
            'azure': { displayName: 'Microsoft Azure', category: 'cloud' },
            'gcp': { displayName: 'Google Cloud', category: 'cloud' },
            'docker': { displayName: 'Docker', category: 'devops' },
            'kubernetes': { displayName: 'Kubernetes', category: 'devops' },
            'jenkins': { displayName: 'Jenkins', category: 'devops' },
            'git': { displayName: 'Git', category: 'tool' },
            'github': { displayName: 'GitHub', category: 'tool' },
            'gitlab': { displayName: 'GitLab', category: 'tool' },
            'ci/cd': { displayName: 'CI/CD', category: 'devops' },
            'terraform': { displayName: 'Terraform', category: 'devops' },

            // Soft Skills
            'liderazgo': { displayName: 'Liderazgo', category: 'soft_skill' },
            'leadership': { displayName: 'Liderazgo', category: 'soft_skill' },
            'comunicación': { displayName: 'Comunicación', category: 'soft_skill' },
            'trabajo en equipo': { displayName: 'Trabajo en equipo', category: 'soft_skill' },
            'teamwork': { displayName: 'Trabajo en equipo', category: 'soft_skill' },
            'problem solving': { displayName: 'Resolución de problemas', category: 'soft_skill' },
            'agile': { displayName: 'Metodologías Ágiles', category: 'methodology' },
            'scrum': { displayName: 'Scrum', category: 'methodology' }
        };

        for (const [key, value] of Object.entries(skillsDatabase)) {
            if (text.includes(key)) {
                foundSkills.push({
                    name: key.replace(/[^a-z0-9]/g, '_'),
                    displayName: value.displayName,
                    category: value.category,
                    level: 'intermediate' // Por defecto
                });
            }
        }

        return foundSkills;
    }
};

module.exports = cvService;
