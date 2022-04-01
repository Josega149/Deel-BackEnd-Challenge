const jobService = require('../service/jobService');

async function payJobByJobId(req, res) {
  const { jobId } = req.params;

  // TODO: Centralize error handling
  try {
    await jobService.payJobByJobId(jobId);
  }
  catch (e) {
    // Prevent sending sensitive info to users.
    return res.status(500).end();
  }

  return res.status(200).end();
}

async function getUnpaidJobs(req, res) {
  const { profile } = req;

  const unpaidJobs = await jobService.getUnpaidJobsByProfile(profile);

  return res.status(200).json(unpaidJobs);
}

module.exports = {
  payJobByJobId,
  getUnpaidJobs
};
