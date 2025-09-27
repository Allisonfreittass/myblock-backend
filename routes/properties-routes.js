const express = require('express')
const router = express.Router();
const multer = require('multer');
const path = require('path');
const propertyController = require('../controller/propertyController');
const auth = require('../services/auth');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

router.get('/properties', propertyController.listAll)

const upload = multer({ storage: storage });
router.post(
  '/properties', 
  auth.authorize, 
  upload.array('imageFiles', 10),
  propertyController.createProperty
);

router.get('/properties/:id', propertyController.getPropertyById)

router.put('/properties/:id/status', auth.authorize, propertyController.updatePropertyStatus)

module.exports = router;