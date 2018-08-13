var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var bcrypt = require('bcryptjs');
var Token = require('./Token');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../user/User');
var crypto = require('../crypt-util');
/**
 * Configure JWT
 */

router.post('/login', function(req, res) {
  User.findOne({ username: req.body.username }, function (err, user) {
    if (err) return res.status(500).send('Internal error');
    if (!user) return res.status(401).send({ auth: false, token: null });
    
    // check if the password is valid
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

    // if user is found and password is valid
    // create a token
    var token = Token.buildToken(user._id);
    user.lastLogin = new Date();
    User.findByIdAndUpdate(user._id, user, function (err, user) {
        if (err) return res.status(500).send('Internal error');
        if (!user) return res.status(401).send('User not found.');
        // return the information including token as JSON
        res.status(200).send({ auth: true, token: token, nickname: user.nickname });
    })
  });
});

router.get('/logout', function(req, res) {
  res.status(200).send({ auth: false, token: null });
});

router.post('/register', function(req, res) {
    console.log("Trying register of user: [" + req.body.username +"|"+req.body.nickname+"|"+req.body.password+"]");
    User.count({username: req.body.username}, function (err, total) {
        if (total > 0) {
            res.redirect(301, req.headers.host + '/me/');
        } else {
            User.countDocuments({
                "created" : {
                    $lte: new Date(),
                    $gt: new Date(new Date().setDate(new Date().getDate()-1))
                }
            }, function (err, total) {
                console.log("total users created today:" + total);
                if (total > 5) {
                    res.status(402).send("You must pay for this service. Please, send an email to @dtodo1paco to know how");
                } else {
                    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
                    User.create({
                        nickname: req.body.nickname,
                        username: req.body.username,
                        password: hashedPassword,
                        created: new Date(),
                        lastLogin: new Date(),
                        key: null
                    },
                    function (err, user) {
                        if (err) return res.status(500).send("There was a problem registering the user`.");
                        var token = Token.buildToken(user._id);
                        res.status(200).send({auth: true, token: token, nickname: user.nickname, username: user.username});
                    });
                }
            });
        }
    });
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
