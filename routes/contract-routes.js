const express = require('express')
const router = express.Router();
const contractController = require('../controller/contractController')

router.get('/contract', contractController.listContract);
router.post('/create', contractController.createContract);

module.exports = router