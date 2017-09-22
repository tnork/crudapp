var mongoose = require('mongoose');
const keys = require('../config/keys');

//Set up default mongoose connection
mongoose.connect(keys.mongoURI);

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var Schema = mongoose.Schema;

  var todosSchema = mongoose.Schema({
    title:  String,
    priority: Number,
    description: String,
    done: Boolean,
    date: String,
    inProgress: Boolean,
    time: String,
    uuid: String
  });

  var Todos = mongoose.model('Todos', todosSchema);

  module.exports = mongoose.model('Todos', todosSchema);
  module.exports.Todos = Todos;
