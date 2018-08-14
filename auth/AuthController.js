var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var Token = require('./Token');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../user/User');
var crypto = require('../crypt-util');

var AccountManager = require('../user/AccountManager');

/**
 * Configure JWT
 */

router.post('/login', function(req, res) {
    AccountManager.doLogin(req.body.username, req.body.password, function (code, result) {
        res.status(code).send(result);
    })
});

router.get('/logout', function(req, res) {
  res.status(200).send(AccountManager.RESPONSE_LOGOUT);
});

router.post('/register', function(req, res) {
    console.log("Trying register of user: [" + req.body.username +"|"+req.body.nickname+"|"+req.body.password+"]");
    AccountManager.doSignup(req.body.username, req.body.password, req.body.nickname, function (code, result) {
        if (code === 301) {
            res.redirect(code, req.headers.host + '/me/');
        } else {
            res.status(code).send(result);
        }
    })
});

router.get('/me', Token.verifyToken, function(req, res, next) {
  User.findById(req.userId, { password: 0 }, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding you.");
    if (!user) return res.status(404).send("No user found for u.");
    user.password = user.key!=null?crypto.encrypt(user.key):null;
    user.key = null;
    res.status(200).send(user);
  });
});


module.exports = router;
