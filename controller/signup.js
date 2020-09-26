const User = require('../model/user');
const common = require('./common');
const {
    check,
    validationResult
} = require('express-validator');
const moment = require('moment');
var fs = require("fs");
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/uploads/');
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '.' + '.jpg');
    }
});

const multerUpload = multer({
    storage: storage
});

class Signup {
    createValidationRules() {
        return [
            check('email').trim().escape().exists().withMessage('required'),
            check('email')
            .trim()
            .escape()
            .isEmail()
            .withMessage('Invalid Email'),
            check('email').custom((value) => {
                return User.findOne({
                    email: value
                }).then((user) => {
                    if (user) {
                        return Promise.reject('E-mail already in use');
                    }
                });
            }),
            check('name')
            .trim()
            .escape()
            .isLength({
                min: 1,
            })
            .withMessage('required'),

            check('password')
            .trim()
            .isLength({
                min: 6,
                max: 15,
            })
            .withMessage(
                'password should be between 6 to 15 characters long'
            ),
            check('birthdate')
            .exists()
            .custom((value) => {
                let isValid = moment(value, 'MM-DD-YYYY').isValid();
                if (isValid) {
                    let bDate = new Date(value)
                    console.log(bDate)
                    let cDate = new Date()
                    if (bDate > cDate)
                        return false
                    else
                        return true
                } else
                    return false
            })
            .withMessage('birth date must be in valid MM-DD-YYYY format and should be less than current date')
        ];
    }
    async doRegister(req, res) {
        try {
            if (!req.files || !req.files[0]) {
                return res.status(400).send({
                    status: 400,
                    message: "profile file is required"
                })
            }
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                let extractedErrors = [];
                errors.array().map((err) =>
                    extractedErrors.push({
                        [err.param]: err.msg,
                    })
                );
                return res.status(422).json({
                    status: 422,
                    message: 'Fail',
                    data: [],
                    errors: extractedErrors,
                });
            }
            var user = new User();
            user.name = req.body.name;
            user.email = req.body.email;
            user.password = await common.bcryptText(req.body.password);
            user.birthDate = new Date(req.body.birthdate);

            const upload = multerUpload.array('profile', 1);
            let isupload = await upload(req, res, (err) => {
                if (err) {
                    if (err && err.message === 'extension_error') {
                        return res.status(422).json({
                            status: 422,
                            errors: [{
                                ErrMsg: 'Only jpeg/jpg/png files are allowed',
                            }, ],
                        });
                    }
                    return res.status(422).json({
                        status: 422,
                        errors: [{
                            ErrMsg: `Unexpected file parameter`,
                        }, ],
                    });
                }
                if (!req.filePath) {
                    return res.status(400).send({
                        status: 400,
                        message: "File not uploaded"
                    })
                }
                return req.filePath

            });
            user.imgUrl = "/public/uploads/" + req.filePath;
            user.save()
                .then(function (result) {
                    if (result) {
                        return res.status(200).send({
                            message: 'Success',
                            data: [],
                        });
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    fs.unlink("./public/uploads/" + req.filePath)
                    if (error) {
                        return res.status(500).send({
                            message: error.errmsg,
                            data: [],
                        });
                    }
                });

        } catch (error) {
            console.log(error);
            if (error) {
                return res.send({
                    status: 500,
                    message: 'Internal Server Error',
                });
            }
        }
    }
}

module.exports = new Signup();