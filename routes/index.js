const express = require('express');
const passport = require('passport');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: './public/images/profiles' })
const util = require('util')
const mongoose = require('mongoose')
  , Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
const Users = require('mongoose').model('User');

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
  Users.find({userID: req.user._id}, (err, user) => {
    if(!err){
      res.render('profile', {title: "Profile", user: user});
    } else {
      res.send(err);
    }
    });

  res.render('profile', { title: 'Profile', user: req.user});
});

router.post('/profile/add', upload.single('mainimage'), isLoggedIn, function(req, res) {
  // Check Image Upload
  if(req.file ){

    var newImageLink = 'images/' + 'profiles/' + req.file.filename;
    Users.findOne({_id: req.user._id}, function(err, user) {
      if(err) {
        throw err;
      } else {
        let passwordDupe = user.local.password;
        let emailDupe = user.local.email;
        let dateJoinDupe = user.local.dateJoin;

        Users.findOneAndUpdate({_id: req.user._id}, {$set: { local :{profileImage: newImageLink, password: passwordDupe, email: emailDupe, dateJoin: dateJoinDupe}}}, { upsert: true, new: true, strict: false }, function(err, usr) {
            if(err) {
              throw err;
            } else {
              console.log('Doc ' + usr)
              res.redirect('/profile');
            }
        });
      }
    });

  }



  // }


});

//
//   Cat.findOneAndUpdate({age: 17}, {$set:{name:"Naomi"}},function(err, doc){
//       if(err){
//           console.log("Something wrong when updating data!");
//       }
//
//     Users.find({_id: req.user._id}, function(err, doc) {
//     if(err) {
//       throw err;
//     } else {
//       if (doc.userID = req.user._id) {
//         Users.findOneAndUpdate({
//             _id: req.user._id
//         }, {
//           profileImage: newImage
//         }, {upsert: true});
//
//
//       }}
//   });
// });

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
  res.redirect('/login');
}

module.exports = router;
