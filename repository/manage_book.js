const DocGia = require('../models/reader');
const { Op } = require('sequelize');

class ManageBookRepository {
  async getAllReaders(keyword = '') {
    return await DocGia.findAll({
      where: keyword ? {
        HoTen: {
          [Op.like]: `%${keyword}%`
        }
      } : {},
      order: [['MaDG', 'ASC']]
    });
  }
}

module.exports = new ManageBookRepository();