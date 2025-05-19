const express = require('express');
const router = express.Router();
const Book = require('../models/book');

// Lấy danh sách tất cả sách
router.get('/', async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tìm kiếm sách theo tên + filter (ví dụ: theo tác giả, năm xuất bản,...)
router.get('/search', async (req, res) => {
  const { name, author, year } = req.query;
  const where = {};

  if (name) where.TenSach = { [Op.like]: `%${name}%` };
  if (author) where.TacGia = { [Op.like]: `%${author}%` };
  if (year) where.NamXuatBan = year;

  try {
    const books = await Book.findAll({ where });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Thêm sách mới
router.post('/', async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Lấy thông tin sách theo ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) res.json(book);
    else res.status(404).json({ error: 'Book not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
