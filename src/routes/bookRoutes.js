const express = require('express');
const router = express.Router();
const Book = require('../models/book');

// Thêm sách
router.post('/', async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    console.error('Error adding book:', err);
    res.status(500).json({ error: 'Failed to add book' });
  }
});

// Lấy danh sách sách
router.get('/', async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

module.exports = router;
