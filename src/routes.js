const express = require('express');
const asyncHandler = require('express-async-handler');

const { getProfile } = require('./middleware/getProfile');

const contractController = require('./controller/contractController');
const jobsController = require('./controller/jobsController');
const profileController = require('./controller/profileController');
const adminController = require('./controller/adminController');

const routes = express.Router();

routes.get('/contracts', getProfile, asyncHandler(contractController.getContracts));
routes.get('/contracts/:id', getProfile, asyncHandler(contractController.getContractById));
routes.get('/jobs/unpaid', getProfile, asyncHandler(jobsController.getUnpaidJobs));

routes.post('/jobs/:jobId/pay', getProfile, asyncHandler(jobsController.payJobByJobId));
routes.post('/balances/deposit/:userId', asyncHandler(profileController.depositBalanceToClient));

routes.get('/admin/best-profession', asyncHandler(adminController.getBestProfession));
routes.get('/admin/best-clients', asyncHandler(adminController.getBestClients));

module.exports = routes;
