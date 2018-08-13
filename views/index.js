var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('home', {
        title: 'REST API app',
        message: 'Hi, you should not be there. This app is about (including Auth, JWT, chatbot, AI,...)'
    });
});

module.exports = router;
