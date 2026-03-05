const express = require("express");
const { getProfile, updateProfile } = require("../controllers/profileController");
const { requireAuth } = require("../utils/authMiddleware");

const router = express.Router();

router.get("/", requireAuth, getProfile);
router.put("/", requireAuth, updateProfile);

module.exports = router;
