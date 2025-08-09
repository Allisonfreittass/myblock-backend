const express = require('express')
const router = express.Router()
const authController = require('../controller/authController')
const auth = require('../services/auth')

router.post('/login', authController.login)
router.post('/register', authController.register)

router.get('/me', auth.authorize, authController.getProfile)

router.put('/associate-wallet', auth.authorize, authController.associateWallet)

router.put('/me', auth.authorize, authController.updateProfile)

module.exports = router;