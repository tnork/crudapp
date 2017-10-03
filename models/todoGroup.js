const mongoose = require('mongoose');
const keys = require('../config/keys');
const db = require('../config/db');

const Schema = mongoose.Schema;

const todoGroupSchema = mongoose.Schema({
  title:  String,
  notes: String,
  todosArray: [],
  num: Number
});

const allGroupSchema = mongoose.Schema({
  groupArray: [],
  num: Number
});

const oneGroup =  mongoose.model('oneGroup', allGroupSchema);
const thisGroup =  mongoose.model('thisGroup', todoGroupSchema);

let allGroups = new oneGroup({
  groupArray: [],
  num: 1
});

let newGroup = new thisGroup({
  title: 'First Group',
  todosArray: [],
  num: 0
});

allGroups.save();
newGroup.save();
// newGroup.save(function(err) {
//       if(!err){
//         res.redirect('/todos');
//       } else {
//         console.log(err);
//       }
// });

module.exports.thisGroup = thisGroup;
