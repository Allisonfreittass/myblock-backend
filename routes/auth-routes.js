const express = require('express')
const router = express.Router()
const authController = require('../controller/authController')
const multer = require('multer');
const path = require('path')
const auth = require('../services/auth')

const storage = multer.diskStorage({
  destination: function (req, file, cb ) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage, limits: { fileSize: 2 * 1024 * 1024 }})

router.post('/login', authController.login)
router.post('/register', authController.register)

router.get('/me', auth.authorize, authController.getProfile)

router.put('/associate-wallet', auth.authorize, authController.associateWallet)

router.put('/me', auth.authorize, upload.single('profilePicture'),authController.updateProfile)

module.exports = router;