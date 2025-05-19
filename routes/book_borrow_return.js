const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/book_borrow_return');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware.requireLibrarian);

router.get('/book/:id', borrowController.getBookInfo);
router.get('/:id', borrowController.showBorrowForm);
router.post('/', borrowController.createBorrow);

module.exports = router;