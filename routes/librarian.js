const express = require('express');
const router = express.Router();
const librarianController = require('../controllers/librarian');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware.requireLibrarian);

router.get('/dashboard', librarianController.showDashboard);
router.get('/register-reader', librarianController.showRegisterForm);
router.post('/register-reader', librarianController.registerReader);

module.exports = router;