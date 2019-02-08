

var User = require('../user/User');
var crypto = require('../crypt-util');
var bcrypt = require('bcryptjs');
var Token = require('../auth/Token');


function doLogin(username, password, callback) {
    User.findOne({ username: username }, function (err, user) {
        if (err)  {
            callback(500, 'Internal error');
        } else if (!user) callback(401, 'Bad credentials')
        else {
            // check if the password is valid
            var passwordIsValid = bcrypt.compareSync(password, user.password);
            if (!passwordIsValid) callback (401, 'Bad credentials');
            else {
                // if user is found and password is valid
                // create a token
                var token = Token.buildToken(user._id);
                user.lastLogin = new Date();
                User.findByIdAndUpdate(user._id, user, function (err, user) {
                    if (err) callback(500, 'Internal error');
                    else if (!user) callback(401, 'Missing user');
                    else {
                        // return the information including token as JSON
                        callback(200, { auth: true, token: token, nickname: user.nickname });
                    }
                })
            }
        }
    });
}
function doSignup(username, password, nickname, callback) {
    User.countDocuments({username: username}, function (err, total) {
        if (total > 0) {
            callback(301, null);
        } else {
            User.countDocuments({
                "created" : {
                    $lte: new Date(),
                    $gt: new Date(new Date().setDate(new Date().getDate()-1))
                }
            }, function (err, total) {
                console.log("total users created today:" + total);
                if (total > 5) {
                    callback(402, "You must pay for this service. Please, send an email to @dtodo1paco to know how");
                } else {
                    var hashedPassword = bcrypt.hashSync(password, 8);
                    User.create(
                        {
                            nickname: nickname,
                            username: username,
                            password: hashedPassword,
                            created: new Date(),
                            lastLogin: new Date(),
                            key: null
                        },
                        function (err, user) {
                            if (err) callback(500, "There was a problem registering the user.");
                            else {
                                var token = Token.buildToken(user._id);
                                callback(200, {auth: true, token: token, nickname: user.nickname, username: user.username});
                            }
                        }
                    );
                }
            });
        }
    });
}


module.exports = {
    "doLogin": doLogin,
    "doSignup": doSignup,
    "RESPONSE_LOGOUT": { auth: false, token: null }
};