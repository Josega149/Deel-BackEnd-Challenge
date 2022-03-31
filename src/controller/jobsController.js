const jobService = require('../service/jobService');

async function payJobByJobId(req, res) {
    const { job_id } = req.params;

    // TODO: Centralize error handling
    try {
        await jobService.payJobByJobId(job_id);
    } catch (e) {
        console.log(e);
        // Prevent sending sensitive info to users. 
        return res.status(500).end();
    }
    
    return res.status(200).end();
}

module.exports = {
    payJobByJobId
};