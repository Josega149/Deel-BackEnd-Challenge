const jobRepository = require('../repository/jobRepository');

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

    let bestProfession = "";
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

async function getBestClients(start, end, limit) {
    const { id } = profile;

    const contracts = await contractRepository.getContractsByProfileId(id);

    return contracts;
}

module.exports = {
    getBestProfession,
    getBestClients
};
