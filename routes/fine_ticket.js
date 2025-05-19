const express = require('express');
const router = express.Router();
const fineController = require('../controllers/fine_ticket');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware.requireLibrarian);

router.get('/:id', fineController.showFineForm);
router.post('/create', fineController.createFineTicket);

module.exports = router;