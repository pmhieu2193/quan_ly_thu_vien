const express = require('express');
const router = express.Router();
const controller = require('../controllers/regulation');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware.requireAdmin);

router.get('/', controller.showChangePage);
router.post('/', controller.handleChange);

module.exports = router;