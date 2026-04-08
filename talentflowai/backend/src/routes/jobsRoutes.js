const express = require("express");
const { listJobs } = require("../controllers/jobsController");

const router = express.Router();

router.get("/", listJobs);

module.exports = router;
