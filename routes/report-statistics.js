const express = require('express');
const router = express.Router();
const { report1, report2 } = require('../controllers/report-statistics');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware.requireAdmin);

router.get('/report1', report1);
router.get('/report2', report2);

module.exports = router;