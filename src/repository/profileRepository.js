const { Op } = require('sequelize');
const {
  Profile, Job, Contract, sequelize
} = require('../model');

async function getProfileById(profileId, transaction) {
  const profile = await Profile.findOne({ where: { id: profileId }, transaction });

  return profile;
}

async function updateProfileBalanceByProfileId(profileId, newBalance, transaction) {
  const profile = await Profile.update({ balance: newBalance }, { where: { id: profileId }, transaction });

  return profile;
}

async function upsertProfile(profile, transaction) {
  return profile.save({ transaction });
}

async function getBestProfessions(start, end) {
  return Profile.findAll(
    {
      attributes: ['profession', [sequelize.fn('sum', sequelize.col('price')), 'totalEarned']],
      group: ['profession'],
      order: [[sequelize.fn('sum', sequelize.col('price')), 'DESC']],
      include: {
        model: Contract,
        as: 'Contractor',
        attributes: [],
        include: {
          model: Job,
          attributes: [],
          where: {
            [Op.and]: [
              {
                paid: { [Op.is]: true }
              },
              {
                createdAt: { [Op.between]: [start, end] }
              }
            ]
          }
        }
      }
    }
  );
}

async function getBestClients(start, end, limit = 2) {
  return Profile.findAll(
    {
      attributes: { include: [[sequelize.fn('sum', sequelize.col('price')), 'totalPaid']] },
      group: ['Profile.id'],
      order: [[sequelize.fn('sum', sequelize.col('price')), 'DESC']],
      where: { type: 'client' },
      limit,
      subQuery: false,
      include: {
        model: Contract,
        as: 'Client',
        attributes: [],
        include: {
          model: Job,
          attributes: [],
          where: {
            [Op.and]: [
              {
                paid: { [Op.is]: true }
              },
              {
                createdAt: { [Op.between]: [start, end] }
              }
            ]
          }
        }
      }
    }

  );
}

module.exports = {
  upsertProfile,
  getProfileById,
  updateProfileBalanceByProfileId,
  getBestProfessions,
  getBestClients
};
