const config = require('../config/config');
const jwt = require("jsonwebtoken")
const jwtSecret = config.jwtSecret
class Auth {
    isAllow(req, res, next) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                throw new Error('Token is not found');
            }
            const accessToken = token.replace('Bearer ', '');

            const results = jwt.verify(accessToken, jwtSecret, {
                algorithms: ['HS256']
            });
            console.log(results)
            req.query.auth = results;
            next();
        } catch (e) {
            console.log(e.message);
            res.status(401).json({
                status: 401,
                message: 'Access Token is not valid or expired',
                data: null
            });
        }
    }
}
module.exports = new Auth()