var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userScheme = mongoose.Schema({
  local: {
    username: String,
    password: String,
    location: String,
    followers: [{
      user: String
    }],
    followed: [{
      user: String
    }]
  }
});

userScheme.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}

userScheme.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.local.password);
}

userScheme.methods.isUserFollower = function(username) {
  if(this.local.followers.indexOf(username) > -1) {
    return true;
  }
}

module.exports = mongoose.model('User', userScheme);
