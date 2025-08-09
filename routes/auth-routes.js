const express = require('express')
const router = express.Router()
const authController = require('../controller/authController')
const auth = require('../services/auth')

router.post('/login', authController.login)
router.post('/register', authController.register)

router.get('/get', authController.getProfile)


module.exports = router;