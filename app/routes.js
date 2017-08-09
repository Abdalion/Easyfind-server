var User = require('../app/models/user');
module.exports = (app, passport) => {

  app.get('/', (req, res) => {
		res.redirect('/profile');
  });

  app.get('/signup', (req, res) => {
    res.render('signup', { message: req.flash('signupMessage') });
  });

  app.get('/login', (req, res) => {
		res.render('login', { message: req.flash('loginMessage') });
  });

  app.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', {user: req.user});
  })

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/')
  })

  // app.get('/api/user/:userid', passport.authenticate('local-finduser', { session: false }),
  // function(req, res) {
  //   console.log('returning user');
  //   res.json({ username: req.user.username, location: req.user.location });
  // });


  app.get('/api/user/:mail', isLoggedIn, (req, res) => {
    res.json({user: req.user});
  });

  app.post('/api/signup', passport.authenticate('local-signup', {
    successRedirect: '/api/success',
    failureRedirect: '/api/failure',
    failureFlash: true
  }));

  app.post('/api/updateLocation', passport.authenticate('local-updateLocation', { session: false }));

  app.post('/api/addFollower', passport.authenticate('local-addFollower', { session: false }));

  app.post('/api/addFollowed', passport.authenticate('local-addFollowed', { session: false }));

  app.post('/api/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
		failureFlash: true
  }));

  app.get('/api/success', (req, res) => {
    res.send('success');
  });

  app.get('/api/failure', (req, res) => {
    res.send('failure');
  });

}

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
}

function isFollower(req, res, next) {

}
