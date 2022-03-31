const { Op } = require('@sequelize/core');
const { Job } = require('../model');
const { Contract } = require('../model');

async function getUnpaidJobsByProfileId(profileId, transaction) {
    const jobs = await Job.findAll({ 
        where: { 
             [Op.and]: [
                 {
                    '$Contract.status$':  {
                         [Op.not]: 'terminated'
                     }
                 },
                 {
                     [Op.or]: [
                         { '$Contract.ClientId$': profileId }, 
                         { '$Contract.ContractorId$' : profileId }
                     ], 
                 }
             ]
        }, include:[{ 
            model: Contract,
            required: true,
        }],
        transaction
    });

    return jobs;
}

async function getJobById(jobId, transaction) {
    const job = await Job.findOne({ where: { id: jobId }, transaction });

    return job;
}

async function upsertJob(jobToUpdate, transaction) {
    return jobToUpdate.save({ transaction });
}

module.exports = {
    getUnpaidJobsByProfileId,
    getJobById,
    upsertJob
};
