const express = require('express');
const router = express.Router();
const ManageBookController = require('../controllers/manage_book');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware.requireLibrarian);
router.get('/', ManageBookController.showUserPage);

module.exports = router;