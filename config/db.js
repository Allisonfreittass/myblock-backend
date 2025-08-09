const { default: mongoose, mongo } = require("mongoose");
require('dotenv').config()

mongoose.connect(process.env.MONGO_URI)