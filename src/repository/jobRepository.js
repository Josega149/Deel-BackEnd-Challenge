const { Op } = require('@sequelize/core');
const { Job } = require('../model');
const { Contract } = require('../model');
const { Profile } = require('../model');

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

async function getAllJobsWithContractors(start, end) {
    const job = await Job.findAll({ 
        where: { 
            [Op.and]: [
                {
                    createdAt: {
                        [Op.gte]: start,  
                    }
                },
                {
                    createdAt: {
                        [Op.lt]: end,  
                    }
                }
            ]
        }, include:[{ 
            model: Contract,
            required: true,
            include:[{ 
                model: Profile,
                required: true,
                as: 'Contractor'
            }]
        }]
    });

    return job;
}

module.exports = {
    getUnpaidJobsByProfileId,
    getJobById,
    upsertJob,
    getAllJobsWithContractors
};
