const { Profile } = require('../model');

async function getProfileById(profileId, transaction) {
  const profile = await Profile.findOne({ where: { id: profileId }, transaction });

  return profile;
}

async function updateProfileBalanceByProfileId(profileId, newBalance, transaction) {
  const profile = await Profile.update({ balance: newBalance }, { where: { id: profileId }, transaction });

  return profile;
}

module.exports = {
  getProfileById,
  updateProfileBalanceByProfileId
};
