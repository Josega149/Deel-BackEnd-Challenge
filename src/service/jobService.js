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
async function payJobByJobId(jobId) {
    return sequelize.transaction(async (transaction) => {
        const job = await jobRepository.getJobById(jobId, transaction);

        const { ContractId, price, paid } = job.dataValues;

        if (paid) {
            throw new Error(`Job with id: ${jobId} was already paid.`);
        }

        const contract = await contractRepository.getContractById(ContractId, transaction);
        const { ContractorId, ClientId } = contract.dataValues;

        const client = await profileRepository.getProfileById(ClientId, transaction);
        const clientBalance = client.dataValues.balance;

        if (clientBalance < price) {
            throw new Error(`Client balance (${clientBalance}) cannot be less than job price (${price}).`);
        }

        const contractor = await profileRepository.getProfileById(ContractorId, transaction);

        const newContractorBalance = contractor.dataValues.balance + price;
        const newClientBalance = clientBalance - price;

        await profileRepository.updateProfileBalanceByProfileId(ContractorId, newContractorBalance, transaction);
        await profileRepository.updateProfileBalanceByProfileId(ClientId, newClientBalance, transaction);

        job.paid = true;
        job.paymentDate = new Date();

        await jobRepository.upsertJob(job, transaction);
    });
}

module.exports = {
    getUnpaidJobsByProfile,
    payJobByJobId
};
