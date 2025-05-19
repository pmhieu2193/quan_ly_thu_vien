const regulationRepo = require('../repository/regulation');

const getCurrentRegulation = async () => {
  return await regulationRepo.getRegulation();
};

const changeRegulation = async (newValues) => {
  return await regulationRepo.updateRegulation(newValues);
};

module.exports = {
  getCurrentRegulation,
  changeRegulation
};
