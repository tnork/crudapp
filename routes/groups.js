const express = require('express');
const router = express.Router();
const url = require('url');
const methodOverride = require('method-override');
const dateFormat = require('dateformat');
const uuid = require('uuid');
const uuidv4 = require('uuid/v4');
const mongoose = require('mongoose')
  , Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
const todoGroup = require('../models/todoGroup');
const thisGroup = require('mongoose').model('thisGroup');

// // View all
// router.get('/all', (req, res) => {
//   mongoose.model('thisGroup').find(function(err, groups) {
//     if(!err){
//     res.render('groupsMain', {title: "All Groups :", groups: groups.reverse()});
//   } else {
//     res.send(err);
//   }
//   });
// });

module.exports = router;
