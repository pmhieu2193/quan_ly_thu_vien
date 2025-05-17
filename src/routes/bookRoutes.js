const express = require('express');
const router = express.Router();
const {
  addBookController,
  getAllBooksController,
  searchBooksController,
} = require('../controllers/bookController');

// Thêm sách
router.post('/', addBookController);

// Lấy danh sách sách hoặc tìm kiếm nếu có query
router.get('/', (req, res) => {
  if (Object.keys(req.query).length > 0) {
    return searchBooksController(req, res);
  } else {
    return getAllBooksController(req, res);
  }
});

module.exports = router;
