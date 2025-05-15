const bookService = require('../services/bookService');

// Tìm kiếm
const searchBooksController = async (req, res) => {
  try {
    const books = await bookService.searchBooks(req.query);
    res.json(books);
  } catch (err) {
    console.error('Error searching books:', err);
    res.status(500).json({ error: 'Lỗi khi tìm kiếm sách' });
  }
};

// Thêm sách
const addBookController = async (req, res) => {
  try {
    const newBook = await bookService.addBook(req.body);
    res.status(201).json(newBook);
  } catch (err) {
    console.error('Error adding book:', err);
    res.status(500).json({ error: 'Lỗi khi thêm sách' });
  }
};

// Hiển thị tất cả sách
const getAllBooksController = async (req, res) => {
  try {
    const books = await bookService.getAllBooks();
    res.json(books);
  } catch (err) {
    console.error('Error getting books:', err);
    res.status(500).json({ error: 'Lỗi khi lấy danh sách sách' });
  }
};

module.exports = {
  searchBooksController,
  addBookController,
  getAllBooksController
};
