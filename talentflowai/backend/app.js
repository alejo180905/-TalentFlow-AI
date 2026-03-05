const express = require("express");
const cors = require("cors");

const authRoutes = require("./src/routes/authRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const jobsRoutes = require("./src/routes/jobsRoutes");
const recommendationRoutes = require("./src/routes/recommendationRoutes");
const applicationRoutes = require("./src/routes/applicationRoutes");
const automationRoutes = require("./src/routes/automationRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
	res.json({ status: "ok", service: "TalentFlow AI API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/automation", automationRoutes);

app.use((err, req, res, next) => {
	const status = err.status || 500;
	res.status(status).json({ message: err.message || "Unexpected server error" });
});

app.listen(PORT, () => {
	console.log(`TalentFlow AI backend running on http://localhost:${PORT}`);
});
