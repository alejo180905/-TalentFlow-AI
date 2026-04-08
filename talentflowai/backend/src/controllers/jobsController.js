const store = require("../models/store");

function listJobs(req, res) {
  return res.json(store.jobs);
}

module.exports = {
  listJobs
};
