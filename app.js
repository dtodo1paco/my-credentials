var express = require('express');
var path = require('path');
var app = express();
var db = require('./db');

var whitelist = ['http://localhost:8080', 'https://dtodo1paco.github.io']
var cors = require('cors');
var corsOptions = {
  origin: function (origin, callback) {
    console.log("origin: "+ origin);
    callback(null, true)
  }
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'pug');

// UI
app.use('/', require(__dirname + '/views/index'));


// REST API
/*
 var UserController = require(__dirname + '/user/UserController');
 app.use('/users', UserController);
*/


var AuthController = require(__dirname + '/auth/AuthController');
app.use('/api/auth', cors(corsOptions), AuthController);


module.exports = app;
