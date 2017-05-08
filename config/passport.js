var localStrategy = require('passport-local').Strategy;

var User = require('../app/models/user');

module.exports = (passport) => {

  passport.serializeUser((user, done) => {
    console.log("DEBUG: serialize");
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use('local-signup', new localStrategy({
    usernameField : 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, email, password, done) => {
    console.log('reached passport use');
    process.nextTick(() => {
      User.findOne({'local.username': email}, (err, user) => {
        if(err)
          return done(err);
        if(user) {
          return done(null, false);
        } else {
          var newUser = new User();
          newUser.local.username = email;
          newUser.local.password = newUser.generateHash(password);
          newUser.local.followers = [];
          newUser.local.followed = []
          newUser.local.location = "";
          console.log('registered' + newUser);
          newUser.save((err) => {
            if(err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }
));

passport.use('local-login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done){
    process.nextTick(function(){
      User.findOne({ 'local.username': email}, function(err, user){
        if(err)
          return done(err);
        if(!user)
          return done(null, false, req.flash('loginMessage', 'No User found'));
        if(!user.validPassword(password)){
          return done(null, false, req.flash('loginMessage', 'inavalid password'));
        }
        return done(null, user);
      });
    });
  }
));

passport.use('local-finduser', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    usernameToFind: 'usernameToFind',
    passReqToCallback: true
  },
  function(req, email, password, userToFind, done){
      User.findOne({ 'local.username': userToFind}, function(err, user){
        if(err)
          return done(err);
        if(!user)
          return done(null, false, req.flash('loginMessage', 'No User found'));
        if(user.isUserFollower(email))
          return done(null, user);
      });
  }
));





}
