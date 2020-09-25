const User = require('../model/user');
const common = require('./common');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const jwtSecret = config.jwtSecret
class Login {
    doLogin(req, res) {
        const {
            email,
            password
        } = req.body
        if (!email || !password) {
            return res.status(400).send({
                status: 400,
                message: "Invalid parameters"
            })
        }
        User.findOne({
                email: req.body.email,
            })
            .then(async (result) => {
                if (result) {
                    var ismatch = await common.compareBcryptText(password, result.password);
                    if (ismatch) {
                        var token = jwt.sign({
                                id: result._id,
                                email: result.email
                            },
                            jwtSecret, {
                                expiresIn: '8h',
                            }
                        );
                        return res.status(200).send({
                            status: 200,
                            message: 'Success',
                            data: {
                                authToken: token,
                            },
                        });
                    } else {
                        return res.status(400).send({
                            status: 400,
                            message: 'Invalid Password',
                        });
                    }
                } else {
                    return res.status(404).send({
                        status: 404,
                        message: 'Email not found',
                    });
                }
            })
            .catch(function (error) {
                // console.log(error)
                return res.status(500).send({
                    status: 500,
                    message: error.errmsg,
                });
            });
    };
}
module.exports = new Login()