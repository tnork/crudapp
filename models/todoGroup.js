const mongoose = require('mongoose');
const keys = require('../config/keys');

//Set up default mongoose connection
mongoose.connect(keys.mongoURI);

//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const Schema = mongoose.Schema;

const todoGroupSchema = mongoose.Schema({
  title:  String,
  todosArray: [],
  num: Number
});

const allGroupSchema = mongoose.Schema({
  groupArray: [],
  num: Number
});

const TaskGroup = mongoose.model('TaskGroup', todoGroupSchema);
const AllGroup = mongoose.model('AllGroup', allGroupSchema);

module.exports.TaskGroup = TaskGroup;
module.exports.AllGroup = AllGroup;
