const contractRepository = require('../repository/contractRepository');

async function getContractById(contractId) {
    const contract = contractRepository.getContractById(contractId);

    return contract;
}

module.exports = {
    getContractById
};
