const profileService = require('../service/profileService');

async function depositBalanceToClient(req, res) {
    const { userId } = req.params;
    const { amount } = req.body;

    // TODO: Centralize error handling
    try {
        await profileService.depositBalanceToClient(userId, amount);
    } catch (e) {
        console.log(e);
        // Prevent sending sensitive info to users. 
        return res.status(500).end();
    }
    
    return res.status(200).end();
}

module.exports = {
    depositBalanceToClient
};
