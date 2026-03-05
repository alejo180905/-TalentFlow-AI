const jobs = [
  {
    id: 1,
    title: "Frontend Developer Jr",
    company: "NovaTech",
    skills: ["javascript", "html", "css", "react"],
    salary: 2800,
    location: "Bogotá",
    modality: "Híbrido",
    description: "Desarrollo de interfaces web modernas para plataforma SaaS."
  },
  {
    id: 2,
    title: "Backend Developer Node.js",
    company: "CloudBridge",
    skills: ["node.js", "express", "sql", "api"],
    salary: 3500,
    location: "Medellín",
    modality: "Remoto",
    description: "Construcción de microservicios y APIs REST escalables."
  },
  {
    id: 3,
    title: "Data Analyst",
    company: "InsightLab",
    skills: ["sql", "python", "power bi", "excel"],
    salary: 3000,
    location: "Bogotá",
    modality: "Presencial",
    description: "Análisis de datos de negocio y visualización de KPIs."
  },
  {
    id: 4,
    title: "Fullstack Developer",
    company: "TalentWorks",
    skills: ["javascript", "node.js", "react", "postgresql"],
    salary: 4200,
    location: "Cali",
    modality: "Remoto",
    description: "Implementación de funcionalidades end-to-end para producto HRTech."
  },
  {
    id: 5,
    title: "QA Automation Engineer",
    company: "QualityFirst",
    skills: ["selenium", "javascript", "testing", "cicd"],
    salary: 3300,
    location: "Medellín",
    modality: "Híbrido",
    description: "Automatización de pruebas para pipelines de integración continua."
  }
];

const store = {
  users: [],
  profiles: {},
  jobs,
  applications: [],
  ids: {
    user: 1,
    application: 1
  }
};

module.exports = store;
