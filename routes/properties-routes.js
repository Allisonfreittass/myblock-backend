const express = require('express')
const router = express.Router();
const propertyController = require('../controller/propertyController');
const auth = require('../services/auth');

router.get('/properties', propertyController.listAll)

router.post('/properties', auth.authorize, propertyController.createProperty)

module.exports = router;