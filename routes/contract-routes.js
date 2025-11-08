const express = require('express')
const router = express.Router();
const contractController = require('../controller/contractController')

router.get('/contracts', contractController.listContract);

router.post('/create', contractController.createContract);

router.put('/contracts/:id/cancel', contractController.cancelContract);

module.exports = router