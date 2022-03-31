const express = require('express');
const asyncHandler = require('express-async-handler');

const { getProfile } = require('./middleware/getProfile');

const contractController = require('./controller/contractController');
const jobsController = require('./controller/jobsController');

const routes = express.Router();


routes.get('/contracts', getProfile, asyncHandler(contractController.getContractById));
routes.get('/contracts/:id', asyncHandler(contractController.getContractById));
routes.get('/jobs/unpaid', asyncHandler(contractController.getContractById));

routes.post('/jobs/:job_id/pay', asyncHandler(jobsController.payJobByJobId));
routes.post('/balances/deposit/:userId', getProfile, asyncHandler(contractController.getContractById));

routes.get('/admin/best-profession?start=<date>&end=<date>', asyncHandler(contractController.getContractById));
routes.get('/admin/best-clients?start=<date>&end=<date>&limit=<integer>', asyncHandler(contractController.getContractById));

module.exports = routes;
