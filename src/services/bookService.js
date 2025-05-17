const Book = require('../models/book');

// Tìm kiếm sách theo tên, tác giả, thể loại (MaTL)
async function searchBooks(criteria) {
  const query = {};

  if (criteria.TenSach) {
    query.TenSach = { $regex: criteria.TenSach, $options: 'i' };
  }

  if (criteria.TacGia) {
    query.TacGia = { $regex: criteria.TacGia, $options: 'i' };
  }

  if (criteria.MaTL) {
    query.MaTL = Number(criteria.MaTL);
  }

  return await Book.find(query);
}

// Thêm sách mới
async function addBook(bookData) {
  const book = new Book(bookData);
  await book.save();
  return book;
}

// Hiển thị danh sách toàn bộ sách
async function getAllBooks() {
  return await Book.find();
}

module.exports = {
  searchBooks,
  addBook,
  getAllBooks
};
