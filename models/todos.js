const mongoose = require('mongoose');
const keys = require('../config/keys');
const db = require('../config/db');

const Schema = mongoose.Schema;

const todosSchema = mongoose.Schema({
  title:  String,
  priority: Number,
  description: String,
  done: Boolean,
  date: String,
  inProgress: Boolean,
  time: String,
  displayAM: Boolean,
  uuid: String
});

const Todos = mongoose.model('Todos', todosSchema);

module.exports = mongoose.model('Todos', todosSchema);
module.exports.Todos = Todos;
