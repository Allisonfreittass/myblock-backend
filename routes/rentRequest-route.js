const express = require('express')
const router = express.Router()
const authService = require('../services/auth')
const rentRequestController = require('../controller/rentRequestController');

router.post('/rent-requests', authService.authorize, rentRequestController.create);

router.get('/rent-requests/my-requests', authService.authorize, rentRequestController.findAll);

router.put('/rent-requests/:id/:status', authService.authorize, rentRequestController.update);

module.exports = router;