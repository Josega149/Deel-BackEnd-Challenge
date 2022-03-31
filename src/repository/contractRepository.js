const { Contract } = require('../model');

async function getContractById(contractId, transaction) {
    const contract = await Contract.findOne({ where: { id: contractId }, transaction });

    return contract;
}

module.exports = {
    getContractById
};
