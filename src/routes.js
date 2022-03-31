const express = require('express');
const asyncHandler = require('express-async-handler');

const { getProfile } = require('./middleware/getProfile');

const contractController = require('./controller/contractController');
const jobsController = require('./controller/jobsController');
const profileController = require('./controller/profileController');

const routes = express.Router();


routes.get('/contracts', getProfile, asyncHandler(contractController.getContracts));
routes.get('/contracts/:id', getProfile, asyncHandler(contractController.getContractById));
routes.get('/jobs/unpaid', getProfile, asyncHandler(jobsController.getUnpaidJobs));

routes.post('/jobs/:job_id/pay', asyncHandler(jobsController.payJobByJobId));
routes.post('/balances/deposit/:userId', asyncHandler(profileController.depositBalanceToClient));

routes.get('/admin/best-profession?start=<date>&end=<date>', asyncHandler(contractController.getContractById));
routes.get('/admin/best-clients?start=<date>&end=<date>&limit=<integer>', asyncHandler(contractController.getContractById));

module.exports = routes;
