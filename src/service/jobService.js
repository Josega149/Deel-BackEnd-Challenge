const { sequelize } = require('../model');

const jobRepository = require('../repository/jobRepository');
const profileRepository = require('../repository/profileRepository');
const contractRepository = require('../repository/contractRepository');

async function getUnpaidJobsByProfile(profile) {
  const { id } = profile;

  const unpaidJobs = await jobRepository.getUnpaidJobsByProfileId(id);

  return unpaidJobs;
}

/*
    Pay for a job.
    A client can only pay if his balance >= the amount to pay.
    The amount should be moved from the client’s balance to the contractor balance.
*/
async function payJobByJobId(jobId, profile) {
  return sequelize.transaction(async (transaction) => {
    const job = await jobRepository.getJobById(jobId, transaction);

    if (!job) {
      throw new Error(`Job with id: ${jobId} does not exist.`);
    }

    const { ContractId, price, paid } = job.dataValues;

    if (paid) {
      throw new Error(`Job with id: ${jobId} is already paid.`);
    }

    const contract = await contractRepository.getContractById(ContractId, transaction);
    const { ContractorId, ClientId } = contract.dataValues;

    if (ClientId !== profile.id) {
      throw new Error(`Profile with id: ${profile.id} is not the client for the job: ${jobId}.`);
    }

    const client = await profileRepository.getProfileById(ClientId, transaction);
    const clientBalance = client.dataValues.balance;

    if (clientBalance < price) {
      throw new Error(`Client balance (${clientBalance}) cannot be less than job price (${price}).`);
    }

    const contractor = await profileRepository.getProfileById(ContractorId, transaction);

    contractor.balance += price;
    client.balance -= price;

    await profileRepository.upsertProfile(contractor, transaction);
    await profileRepository.upsertProfile(client, transaction);

    job.paid = true;
    job.paymentDate = new Date();

    await jobRepository.upsertJob(job, transaction);
  });
}

module.exports = {
  getUnpaidJobsByProfile,
  payJobByJobId
};
