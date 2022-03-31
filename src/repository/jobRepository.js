const { Job } = require('../model');

async function getJobById(jobId, transaction) {
    const job = await Job.findOne({ where: { id: jobId }, transaction });

    return job;
}

async function upsertJob(jobToUpdate, transaction) {
    return jobToUpdate.save({ transaction });
}

module.exports = {
    getJobById,
    upsertJob
};
