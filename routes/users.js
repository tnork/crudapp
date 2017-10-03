const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: './uploads'});
const mongoose = require('mongoose')
  , Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
const User = require('../models/users');
const Users = require('mongoose').model('Users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', {title: 'Register'});
});

router.get('/login', function(req, res, next) {
  res.render('login', {title: 'Login'});
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
    var newUser = new Users({
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
  newUser.save(callback);
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
