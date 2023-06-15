const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS'){ // OPTIONS is a default method sent by the browser to check if the server is up and running
        return next();
    }
    let token;
    try {
        token = req.headers.authorization.split(' ')[1] // Bearer TOKEN
        if (!token) {
            throw new Error('Authentication failed');
        }
        const decodedToken = jwt.verify(token, 'supersecret_dont_share');
        req.userData = { 
            userId: decodedToken.userId,
            email: decodedToken.email 
        };
        next();
    }
    catch (err) {
        const error = new HttpError('Authentication failed', 403);
        return next(error);
    }
};