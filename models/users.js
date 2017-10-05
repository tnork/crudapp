const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

// User Schema
const userSchema = mongoose.Schema({
	local: {
		name: {
		type: String,
		index: true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	dateJoin:{
		type: String
	}},
});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
