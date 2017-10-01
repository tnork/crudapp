const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register',{title:'Register'});
});

router.get('/login', function(req, res, next) {
  res.render('login', {title:'Login'});
});

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
