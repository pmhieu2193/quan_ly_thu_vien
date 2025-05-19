const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book');

router.get('/', bookController.showIndex);
router.get('/book/:id', bookController.getBookDetail);
router.get('/search', bookController.searchBooks);
router.get('/api/books/search', bookController.searchBooks);
router.get('/api/books/:id', bookController.getBookById);

module.exports = router;