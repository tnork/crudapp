const mongoose = require('mongoose');
const keys = require('../config/keys');

//Set up default mongoose connection
mongoose.connect(keys.mongoURI);

//Get the default connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports.db = db;
