const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: './uploads'});
const mongoose = require('mongoose')
  , Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
const Users = require('../models/users');
const User = require('mongoose').model('User');
const session = require('express-session');
const passport = require('passport');
const ExpressValidator = require('express-validator');
const flash = require('connect-flash');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
  res.render('login', {title: 'Login'});
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done){
  User.getUserByUsername(username, function(err, user){
    if(err) throw err;
    if(!user){
      console.log('Unknown user');
      return done(null, false, {message: 'Unknown User'});
    }

    User.comparePassword(password, user.password, function(err, isMatch){
      if(err) return done(err);
      if(isMatch){
        console.log('Passwords match');

        return done(null, user);
      } else {
        console.log('Passwords don\'t match');

        return done(null, false, {message:'Invalid Password'});
      }
    });
  });
}));

router.post('/login',
  passport.authenticate('local',{failureRedirect:'/users/login', failureFlash: 'Invalid username or password'}),
  function(req, res) {
    console.log(req.body);
   req.flash('success', 'You are now logged in');
   res.redirect('/todos');
});

router.get('/register', function(req, res, next) {
  res.render('register', {title: 'Register'});
});

router.post('/register', upload.single('profile'), function(req, res, next) {
  // console.log(req.body);
  let name = req.body.name;
  let email = req.body.email;
  let username = req.body.username;
  let password1 = req.body.password1;
  let password2 = req.body.password2;

  if(req.file){
    var profileIMG = req.file.filename;
  } else {
    var profileIMG = 'noimage2.jpg';
  }

  // Form Validator
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password1', 'Password is required').notEmpty();
  req.checkBody('password2', 'Second password to confirm is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(password1);

  // Check errors
  var errors = req.validationErrors();

  if(errors) {
    res.render('register', {errors: errors});
  } else {
    // console.log('No errors' + 'pofileIMG =' + profileIMG);
    var newUser = new User({
      username: username,
      password: password1,
      email: email,
      name: name,
      profileImage: profileIMG
    });

    createUser(newUser, function(err, user){
      if(err) throw err;
      // console.log(user);
    });

    req.flash('success', 'You are now registered with Todo Depot and can login');

    res.location('/');
    res.redirect('/');
  }
});

function createUser(newUser, callback) {
  bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash(newUser.password, salt, function(err, hash){
      //store hash in db
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

  // console.log(req.file);
  // { fieldname: 'profile',
  // originalname: 'download.png',
  // encoding: '7bit',
  // mimetype: 'image/png',
  // destination: './uploads',
  // filename: '4dc22774c8096fb3bc7f3579ce743c61',
  // path: 'uploads\\4dc22774c8096fb3bc7f3579ce743c61',
  // size: 139112 }

  // res.render();


module.exports = router;



// router.get('/:userId', function(req, res, next) {
//   mongoose.model('Users').find({userId: req.params.userId}, function(err, todos) {
//     mongoose.model('Users').populate(users, {path: 'user'}, function(err, todos) {
//       res.send(users);
//     });
//     if(!err){
//     res.send(users);
//   } else {
//     res.send(err);
//   }
//   });
// });
