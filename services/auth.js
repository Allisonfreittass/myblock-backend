'use strict'
const jwt = require('jsonwebtoken');

global.SALT_KEY = process.env.SALT_KEY;

exports.authorize = function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) {
        return res.status(401).send({ auth: false, message: "Token não fornecido" });
    }

    jwt.verify(token, global.SALT_KEY, function(err, decoded) {
        if (err) {
            console.log("Erro ao verificar token:", err.message);
            return res.status(401).json({ message: "Token inválido ou expirado" });
        } else {
            req.userId = decoded.userId;
            next();
        }
    });
};