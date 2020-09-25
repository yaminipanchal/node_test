var express = require('express');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
var multer = require('multer');
var fs = require('fs');
var path = require('path');

// initialize our express app
const config = require('./config/config');
const url = config.database.url;
const port = config.port;
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
// for parsing application/json
app.use(bodyParser.json());
// for parsing application/xwww-
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

// for parsing multipart/form-data
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/uploads/');
    },
    filename: function (req, file, callback) {
        req.filePath = Date.now() + '.jpg'
        callback(null, req.filePath);
    }
});
var upload = multer({
    storage
});
app.use(upload.any());

const mongoDB = process.env.MONGODB_URI || url;
mongoose.connect(mongoDB, {
    useCreateIndex: true,
    useNewUrlParser: true,
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//add one folder then put your route files there my router folder name is routers
fs.readdirSync('./routes').forEach(function (file) {
    var route = './routes/' + file;
    require(route)(app);
});

app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});
module.exports = app;