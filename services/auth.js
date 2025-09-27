'use strict'
const jwt = require('jsonwebtoken');

global.SALT_KEY = process.env.SALT_KEY;

exports.authorize = function (req, res, next) {
    let token;

if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.substring(7, req.headers.authorization.length);
    } 
    else {
        token = (req.body && req.body.token) || req.query.token || req.headers['x-access-token'];
    }

    if (!token) {
        return res.status(401).json({ message: "Acesso Restrito: Token não fornecido." });
    }

    jwt.verify(token, global.SALT_KEY, function(err, decoded) {
        if (err) {
            console.log("Erro ao verificar token:", err.message);
            return res.status(401).json({ message: "Token inválido ou expirado." });
        } else {
           // console.log('Payload do Token Decodificado:', decoded);
            req.user = decoded; 
            next(); 
        }
    });
};