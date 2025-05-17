const Sach = require('../models/book'); 
const { Op } = require('sequelize');

const addBook = async (bookData) => {
  return await Sach.create(bookData);
};

const getAllBooks = async () => {
  return await Sach.findAll();
};

const searchBooks = async (query) => {
  const where = {};

  if (query.TenSach) {
    where.TenSach = { [Op.like]: `%${query.TenSach}%` };
  }

  if (query.TacGia) {
    where.TacGia = { [Op.like]: `%${query.TacGia}%` };
  }

  if (query.NamXuatBan) {
    where.NamXuatBan = query.NamXuatBan;
  }

  return await Sach.findAll({ where });
};

module.exports = {
  addBook,
  getAllBooks,
  searchBooks,
};
