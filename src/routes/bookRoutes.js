const express = require('express');
const router = express.Router();
const {
  searchBooksController,
  addBookController,
  getAllBooksController
} = require('../controllers/bookController');

// GET /books/search?TenSach=abc&TacGia=xyz&MaTL=1
router.get('/search', searchBooksController);

// GET /books
router.get('/getAll', getAllBooksController);

// POST /books
router.post('/addBook', addBookController);

module.exports = router;
