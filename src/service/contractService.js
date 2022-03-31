const contractRepository = require('../repository/contractRepository');

async function getContractById(contractId, profile) {
    const contract = await contractRepository.getContractById(contractId);

    if (!contract) {
        return undefined;
    }

    const { id } = profile;
    const { ContractorId, ClientId } = contract;

    if (id !== ContractorId && id !== ClientId) {
        throw new Error(`Profile with id ${id} is unauthorized to read contract with id ${contractId}.`);
    }

    return contract;
}

module.exports = {
    getContractById
};
