const Regulation = require('../models/regulation');

const getRegulation = async () => {
  return await Regulation.findByPk(1); 
};

const updateRegulation = async (data) => {
  const reg = await Regulation.findByPk(1);
  if (!reg) throw new Error('Không tìm thấy quy định');
  return await reg.update(data);
};

module.exports = {
  getRegulation,
  updateRegulation
};
