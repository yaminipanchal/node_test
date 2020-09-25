const signup = require('../controller/signup');
const auth = require("../middleware/authorize");
const profile = require("../controller/user");

module.exports = function (app) {
    app.post('/signup', signup.createValidationRules(), signup.doRegister);
    app.get('/profile', auth.isAllow, profile.getProfile);
};