const DocGia = require('../models/reader');
const { Op } = require('sequelize');

class LibrarianRepository {
  async getAllReaders() {
    return await DocGia.findAll();
  }

  async createReader(readerData) {
    return await DocGia.create(readerData);
  }

  async findByEmail(email) {
    return await DocGia.findOne({
      where: { Email: email }
    });
  }
}

module.exports = LibrarianRepository;