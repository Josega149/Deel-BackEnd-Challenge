const contractService = require('../service/contractService');

async function getContractById(req, res) {
    const { id } = req.params;

    const contract = await contractService.getContractById(id);

    if (!contract) {
        return res.status(404).end();
    }

    return res.status(200).json(contract);
}

module.exports = {
    getContractById
};
