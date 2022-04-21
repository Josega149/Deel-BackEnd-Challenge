const { Op } = require('@sequelize/core');
const { Job } = require('../model');
const { Contract } = require('../model');
const { Profile } = require('../model');

async function getUnpaidJobsByProfileId(profileId, transaction) {
  const jobs = await Job.findAll({
    where: {
      [Op.and]: [
        {
          paid: { [Op.not]: true }
        },
        {
          '$Contract.status$': {
            [Op.not]: 'terminated'
          }
        },
        {
          [Op.or]: [
            { '$Contract.ClientId$': profileId },
            { '$Contract.ContractorId$': profileId }
          ]
        }
      ]
    },
    include: [{
      model: Contract,
      required: true
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
  const jobs = await Job.findAll({
    where: {
      [Op.and]: [
        {
          createdAt: {
            [Op.gte]: start
          }
        },
        {
          createdAt: {
            [Op.lt]: end
          }
        },
        {
          paid: {
            [Op.is]: true
          }
        }
      ]
    },
    include: [{
      model: Contract,
      required: true,
      include: [{
        model: Profile,
        required: true,
        as: 'Contractor'
      }]
    }]
  });

  return jobs;
}

async function getAllJobsWithClients(start, end) {
  const jobs = await Job.findAll({
    where: {
      [Op.and]: [
        {
          createdAt: {
            [Op.gte]: start
          }
        },
        {
          createdAt: {
            [Op.lt]: end
          }
        },
        {
          paid: {
            [Op.is]: true
          }
        }
      ]
    },
    include: [{
      model: Contract,
      required: true,
      include: [{
        model: Profile,
        required: true,
        as: 'Client'
      }]
    }]
  });

  return jobs;
}

async function getSumOfJobsToPay(clientId, transaction) {
  return Job.sum(
    'price',
    {
      where: { paid: { [Op.not]: true } },
      include: {
        model: Contract,
        where: { ClientId: clientId },
        required: true
      },
      transaction
    }
  );
}

module.exports = {
  getSumOfJobsToPay,
  getUnpaidJobsByProfileId,
  getJobById,
  upsertJob,
  getAllJobsWithContractors,
  getAllJobsWithClients
};
