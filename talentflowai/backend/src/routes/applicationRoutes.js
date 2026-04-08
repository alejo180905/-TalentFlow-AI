const express = require("express");
const {
  createApplication,
  listApplications,
  updateApplicationStatus
} = require("../controllers/applicationController");
const { requireAuth } = require("../utils/authMiddleware");

const router = express.Router();

router.post("/", requireAuth, createApplication);
router.get("/", requireAuth, listApplications);
router.patch("/:id/status", requireAuth, updateApplicationStatus);

module.exports = router;
