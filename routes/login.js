const login = require('../controller/login');

module.exports = function (app) {

    app.post("/login", login.doLogin)
}