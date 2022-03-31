const contractService = require('../service/contractService');

async function getContractById(req, res) {
    const { id } = req.params;
    const { profile } = req;

    // TODO: Centralize error handling. This function throws exception if the profile is unauthorized.
    const contract = await contractService.getContractById(id, profile);

    if (!contract) {
        return res.status(404).end();
    }

    return res.status(200).json(contract);
}

module.exports = {
    getContractById
};
