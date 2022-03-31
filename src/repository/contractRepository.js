const { Contract } = require('../model');
const { Op } = require('@sequelize/core');

async function getContractById(contractId, transaction) {
    const contract = await Contract.findOne({ where: { id: contractId }, transaction });

    return contract;
}

async function getContractsByProfileId(profileId) {
    const contracts = await Contract.findAll({ 
        where: { 
            [Op.and]: [
                {
                    status:  {
                        [Op.not]: 'terminated'
                    }
                },
                {
                    [Op.or]: [
                        { ClientId: profileId }, 
                        { ContractorId : profileId }
                    ], 
                }
            ]
        }
    });

    return contracts;
}

module.exports = {
    getContractById,
    getContractsByProfileId
};

/*
const contract = await Contract.findAll({ 
    where: { 
        status:  {
           [Op.not]: 'terminated'
        }
    },
});
*/
