const { sequelize } = require('../model');

const jobRepository = require('../repository/jobRepository');
const profileRepository = require('../repository/profileRepository');

/*
    Deposits money into the the the balance of a client.
    A client can’t deposit more than 25% his total of jobs to pay. (at the deposit moment)
*/
async function depositBalanceToClient(clientId, amount) {
  return sequelize.transaction(async (transaction) => {
    const profile = await profileRepository.getProfileById(clientId, transaction);

    if (profile.dataValues.type !== 'client') {
      throw new Error(`User with id (${clientId}) is not "client" type.`);
    }

    const jobs = await jobRepository.getUnpaidJobsByProfileId(clientId, transaction);

    let totalDueAmountAtJobsToPay = 0;

    for (let i = 0; i < jobs.length; i += 1) {
      const job = jobs[i];
      totalDueAmountAtJobsToPay += job.dataValues.price;
    }

    if (amount > 0.25 * totalDueAmountAtJobsToPay) {
      throw new Error(
        `A client can't deposit more than 25% of his total of jobs to pay. Due amount: (${totalDueAmountAtJobsToPay}). 
         Amount to add: ${amount}.`
      );
    }

    const newBalance = profile.dataValues.balance + amount;

    await profileRepository.updateProfileBalanceByProfileId(clientId, newBalance, transaction);
  });
}

module.exports = {
  depositBalanceToClient
};
