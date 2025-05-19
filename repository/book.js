const Sach = require('../models/book');
const { Op } = require('sequelize');

class BookRepository {
  async findAll() {
    return await Sach.findAll({
      include: ['TheLoai']
    });
  }

  async findById(id) {
    return await Sach.findByPk(id, {
      include: ['TheLoai']
    });
  }

  async search(query) {
    const where = {};
    if (query.name) {
      where.TenSach = { [Op.like]: `%${query.name}%` };
    }
    if (query.author) {
      where.TacGia = { [Op.like]: `%${query.author}%` };
    }
    return await Sach.findAll({
      where,
      include: ['TheLoai']
    });
  }
}

module.exports = new BookRepository();