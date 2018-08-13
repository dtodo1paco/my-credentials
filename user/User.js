var mongoose = require('mongoose');  
var UserSchema = new mongoose.Schema({  
  nickname: String,
  username: String,
  password: String,
  key: String,
  created: Date,
  lastLogin: Date
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');
