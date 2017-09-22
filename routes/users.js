const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const uuidv4 = require('uuid/v4');

const mongoose = require('mongoose');

  /* GET Users pages. */
router.get('/', (req, res) => {
  mongoose.model('Users').find((err, users) =>{
    if(!err){
    res.send(users);
  } else {
    res.send(err);
  }
  });
});

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

module.exports = router;
