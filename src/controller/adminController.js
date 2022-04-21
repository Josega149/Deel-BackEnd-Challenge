const adminService = require('../service/adminService');

async function getBestProfession(req, res) {
  const { start, end } = req.query;
  const professions = await adminService.getBestProfessionsByQuery(start, end);

  return res.status(200).json(professions[0]);
}

async function getBestClients(req, res) {
  const { start, end, limit } = req.query;
  const clients = await adminService.getBestClientsByQuery(start, end, limit);

  // Parse results to match expected json
  const parsedClients = clients.map(
    (client) => ({
      id: client.id,
      fullName: `${client.firstName} ${client.lastName}`,
      paid: client.dataValues.totalPaid
    })
  );

  return res.status(200).json(parsedClients);
}

module.exports = {
  getBestProfession,
  getBestClients
};
