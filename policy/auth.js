var jwt = require('jsonwebtoken'),
    jwtSecret = "thisIsMySecretPasscode";

exports.isAllowed = function(req, res, next) {


    var aHeader = req.get("authToken");
    // console.log(aHeader)
    //Check if this request is signed by a valid token
    var token = null;
    if (typeof aHeader != 'undefined') {
        token = aHeader;
        try {
            // console.log("token", token)
            jwt.verify(token, jwtSecret, function(error, decoded) {
                // console.log(error, decoded)
                if (decoded) {
                    req.token = decoded;
                    next()
                    return null;
                }
            });
            return null;

        } catch (err) {
            if (err) {
                return res.status(401).json({
                    code: 401,
                    message: 'Unauthorized'
                });
            }
        }
    } else {
        return res.status(401).json({
            code: 401,
            message: 'Unauthorized'
        });
    }
};