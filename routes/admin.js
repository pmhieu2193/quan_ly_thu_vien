const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware.requireAdmin);

router.get('/dashboard', adminController.showDashboard);
router.get('/register-librarian', adminController.showRegisterForm);
router.post('/register-librarian', adminController.registerLibrarian);

module.exports = router;