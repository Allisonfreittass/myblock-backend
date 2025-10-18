const jwt = require('jsonwebtoken')
const User = require('../models/User')

const loadUserOptional = async (req, res, next ) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return next()
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
        return next()
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select('-password')

        if (!user) {
            req.user = user
        }

        next()
    } catch (error) {
        next()
    }
}

module.exports = loadUserOptional;