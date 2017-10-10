const express = require('express');
const passport = require('passport');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: './uploads'});
const util = require('util')

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Todo Depot' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login', message: req.flash('loginMessage') });
});

router.get('/signup', function(req, res) {
  res.render('signup', { title: 'Sign Up', message: req.flash('loginMessage') });
});

router.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile', { title: 'Profile', user: req.user });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true,
}));


router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true,
}));

function isLoggedIn(req, res, next) {
  // console.log('Req' + util.inspect(req));
  // console.log(req.user._id);
  if (req.isAuthenticated())
      return next();
  res.redirect('/signup');
}

module.exports = router;
