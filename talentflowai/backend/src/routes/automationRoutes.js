const express = require("express");
const { runAutoApply } = require("../controllers/automationController");
const { requireAuth } = require("../utils/authMiddleware");

const router = express.Router();

router.post("/run", requireAuth, runAutoApply);

module.exports = router;
