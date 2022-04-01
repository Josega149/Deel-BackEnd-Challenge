const adminService = require('../service/adminService');

async function getBestProfession(req, res) {
  const { start, end } = req.query;
  const profession = await adminService.getBestProfession(start, end);

  return res.status(200).json(profession);
}

async function getBestClients(req, res) {
  const { start, end, limit } = req.query;
  const clients = await adminService.getBestClients(start, end, limit);

  return res.status(200).json(clients);
}

module.exports = {
  getBestProfession,
  getBestClients
};
