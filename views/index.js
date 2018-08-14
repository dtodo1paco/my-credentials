var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var AccountManager = require('../user/AccountManager');

const params = {
    title: 'My Credentials',
    message:{
        error: null,
        success: null
    },
    user: {
        username: null,
        nickname: null,
        token: null
    }
}

router.get('/', function(req, res) {
    res.render('home', params);
});
router.post('/login', function(req, res) {
    let p = JSON.parse(JSON.stringify(params));
    AccountManager.doLogin(req.body.username, req.body.password, function (code, result) {
        if (code === 200) {
            p.user = {
                nickname: result.nickname,
                token: result.token
            };
            p.message.success = "Yeah! you successfully did login.";
        } else {
            p.message.error = result;
        }
        res.render('home', p);
    })
});
router.get('/logout', function(req, res) {
    res.redirect("/");
});
router.post('/signup', function(req, res) {
    let p = JSON.parse(JSON.stringify(params));
    p.user = {
        username: req.body.username,
        nickname: req.body.nickname
    };

    if (req.body.password != req.body.password2) {
        p.message.error = "Please, be sure to repeat the password correctly";
        res.render('home', p);
    } else {
        AccountManager.doSignup(req.body.username, req.body.password, req.body.nickname, function (code, result) {
            if (code === 200) {
                p.user = {
                    username: result.username,
                    nickname: result.nickname,
                    token: result.token
                };
                p.message.success = "Yeah! you have been registered successfully.";
            } else if (code === 301) {
                p.message.error = "User ["+req.body.username+"] already exists. Try to login.";
            } else {
                p.message.error = result;
            }
            res.render('home', p);
        })
    }
});
module.exports = router;
