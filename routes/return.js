const express = require('express');
const router = express.Router();
const returnController = require('../controllers/return');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware.requireLibrarian);
router.get('/books/:id', returnController.getBorrowedBooks);
router.get('/:id', returnController.showReturnForm);
router.post('/process', returnController.processReturn);

module.exports = router;