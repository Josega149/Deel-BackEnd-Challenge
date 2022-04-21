const jobRepository = require('../repository/jobRepository');
const profileRepository = require('../repository/profileRepository');

async function getBestProfession(start, end) {
  const professionHashMap = {};

  const allJobsBetweenDates = await jobRepository.getAllJobsWithContractors(start, end);

  for (let i = 0; i < allJobsBetweenDates.length; i += 1) {
    const currentJob = allJobsBetweenDates[i];

    const professionName = currentJob.dataValues.Contract.dataValues.Contractor.dataValues.profession;

    if (!professionHashMap[professionName]) {
      professionHashMap[professionName] = 0;
    }

    professionHashMap[professionName] += currentJob.dataValues.price;
  }

  const professions = Object.keys(professionHashMap);

  let bestProfession = '';
  let amountEarnedByBestProfession = 0;
  for (let i = 0; i < professions.length; i += 1) {
    const profession = professions[i];
    if (professionHashMap[profession] > amountEarnedByBestProfession) {
      bestProfession = profession;
      amountEarnedByBestProfession = professionHashMap[profession];
    }
  }

  return bestProfession;
}

async function getBestClients(start, end, limit = 2) {
  const clientsHashMap = {};

  const allJobsBetweenDates = await jobRepository.getAllJobsWithClients(start, end);

  for (let i = 0; i < allJobsBetweenDates.length; i += 1) {
    const currentJob = allJobsBetweenDates[i];

    const clientFirstName = currentJob.dataValues.Contract.dataValues.Client.dataValues.firstName;
    const clientLastName = currentJob.dataValues.Contract.dataValues.Client.dataValues.lastName;

    const clientName = clientFirstName + clientLastName;

    if (!clientsHashMap[clientName]) {
      clientsHashMap[clientName] = 0;
    }

    clientsHashMap[clientName] += currentJob.dataValues.price;
  }

  const clients = Object.keys(clientsHashMap);
  const array = [];
  for (let i = 0; i < clients.length; i += 1) {
    const key = clients[i];
    array.push({ name: key, value: clientsHashMap[key] });
  }

  // eslint-disable-next-line no-nested-ternary
  const sortedClients = array.sort((a, b) => ((a.value > b.value) ? -1 : ((b.value > a.value) ? 1 : 0)));

  const bestClients = [];

  for (let i = 0; i < sortedClients.length && i < limit; i += 1) {
    const sortedClient = sortedClients[i];
    bestClients.push(sortedClient.name);
  }

  return bestClients;
}

async function getBestProfessionsByQuery(start, end) {
  const professionsOrderedByTotalEarned = await profileRepository.getBestProfessions(start, end);

  return professionsOrderedByTotalEarned;
}

async function getBestClientsByQuery(start, end, limit) {
  const bestClients = await profileRepository.getBestClients(start, end, limit);

  return bestClients;
}

module.exports = {
  getBestProfessionsByQuery,
  getBestClientsByQuery,
  getBestProfession,
  getBestClients
};
