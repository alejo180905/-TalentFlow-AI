const express = require("express");
const { listRecommendations } = require("../controllers/recommendationController");
const { requireAuth } = require("../utils/authMiddleware");

const router = express.Router();

router.get("/", requireAuth, listRecommendations);

module.exports = router;
