const express = require('express');
const router = express.Router();
const url = require('url');
const methodOverride = require('method-override');
const dateFormat = require('dateformat');
const uuid = require('uuid');
const uuidv4 = require('uuid/v4');
const keys = require('../config/keys');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose')
  , Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
const todos = require('../models/todos');
const Todos = require('mongoose').model('Todos');
const todoGroup = require('../models/todoGroup');
const thisGroup = require('mongoose').model('thisGroup');

// View all
router.get('/', (req, res) => {
  mongoose.model('Todos').find(function(err, todos) {
    if(!err){
    res.render('all', {title: "All Todos :", todos: todos.reverse()});
  } else {
    res.send(err);
  }
  });
});

// View all
router.get('/compressedtodos', (req, res) => {
  mongoose.model('Todos').find(function(err, todos) {
    if(!err){
    res.render('compressedtodos', {title: "Quick View :", todos: todos.reverse(), timing: displayTime(), date: todaysDate()});
  } else {
    res.send(err);
  }
  });
});

// New View
router.get('/new', (req, res) => {
  res.render('new', {title: "New Todo :"});
});

// Groups Main
router.get('/groups', (req, res) => {
  thisGroup.find(function(err, groups) {
    if(!err){
    res.render('groupsMain', {title: "All Groups :", groups: groups.reverse()});
  } else {
    res.send(err);
  }
  });
});

// View one
router.get('/:id', (req, res) => {
  let id = req.params.id;
  if(typeof id !='undefined') {

    mongoose.model('Todos').findOne({uuid: id}, (err, doc) => {
      res.render('one', {title: "Todo Details :", doc});
    });
  } else {
    res.render('error', {message: 'Sorry. That ID is invalid.'});
} });

// Create New Todo (Mongoose doesn't use arrow functions)
router.post('/', function(req, res, next) {
  if (req.body.inProgress === 'null') {
    req.body.inProgress = false;
  }

  let addTodo = new Todos ({
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    done: false,
    date: todaysDate(),
    inProgress: req.body.inProgress,
    time: displayTime(),
    displayAM: AMDecider(),
    uuid: uuidv4()
  });

   if(validTodo(addTodo)){
      addTodo.save(function(err) {
        if(!err){
          res.redirect('/todos');
        } else {
          res.send(err);
    }});
}});

// Update
router.post('/update/:id', (req, res, next) => {
  var id = req.params.id;
  console.log(req.body.description);
  Todos.findOneAndUpdate({
      uuid: id
  }, {
    title: req.body.title == '' ? lookupTitle(id) : req.body.title,
    description: req.body.description === '' || req.body.description === null || req.body.description === undefined ? lookupDescription(id) : req.body.description,
    priority: req.body.priority,
    done: false,
    date: todaysDate(),
    inProgress: req.body.inProgress == 'false' ? false : true,
    time: displayTime(),
    displayAM: AMDecider(),
    uuid: id
  }, {upsert: true, 'new': true}, function(err, res) {
  });

  mongoose.model('Todos').find(function(err, todos) {
    if(!err){
      res.redirect('/todos');
    } else {
        res.send(err);
    }});
  });

// Edit
router.get('/edit/:id', (req, res, next) => {
  let id = req.params.id;
  if(typeof id !='undefined') {

    mongoose.model('Todos').findOne({uuid: id}, (err, doc) => {
      res.render('edit', {title: "Edit Todo :", doc});
    });
  } else {
    res.render('error', {message: 'Sorry. That ID is invalid.'});
} });

// Delete
router.get('/delete/:id', (req, res, next) => {
  let id = req.params.id;
  if(typeof id !='undefined') {

    mongoose.model('Todos').find({uuid: id}).remove().exec();

    setTimeout(function(){
      mongoose.model('Todos').find(function(err, todos) {
        if(!err){
          res.render('all', {title: "All Todos :", todos: todos.reverse()});
        } else {
          res.send(err);
      }})
    }, 300);
}});

// Get contact form
router.get('/contact/form', (req, res, next) => {
  res.render('contactForm', {title: "Contact Todo Depot :", siteKey: keys.recaptchaSiteKey});
});

// Email contact message
router.post('/contact/form/submit', (req, res, next) => {

var transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: keys.emailUser,
			pass: keys.emailPass
		}
	});

	var mailOptions = {
		to: 'tylerdnorkus@gmail.com',
		subject: 're: Todo Depot Web App',
		text: 'You have a submission with the following details... Name: '+ req.body.name + 'Email: ' + req.body.email + 'Message: ' + req.body.message,
		html: '<p>You have a submission with the following details...</p><ul><li>Name: ' + req.body.name + '</li><li>Email: ' + req.body.email + '</li><li>Message: ' + req.body.message + '</li></ul>'
	};

	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			// console.log(error);
      var eMessage = 'Sorry. That email message was not submitted through the GSMTP.' + error;
      res.render('error', {message: eMessage});
		} else {
			// console.log('Message Sent: ' + info.response);
			res.redirect('/');
		}
	});
});

// Validation for New Todo (Is already required field in view template anyway), returns true if valid
function validTodo(todo) {
  return typeof todo.title == 'string' && typeof todo.title.trim() != '' && typeof todo.priority == 'number';
}

function lookupDescription(id) {
  mongoose.model('Todos').findOne({uuid: id}, (err, doc) => {
    if(!err){
      return doc.description;
    }
  });
}

function lookupTitle(id) {
  mongoose.model('Todos').findOne({uuid: id}, (err, doc) => {
      if (err) return handleError(err);
      if (doc.title != '') {
          return doc.title
      } else {
        return 'Add a Title';
      }
  });
}

function displayTime() {
  return new Date().toLocaleTimeString({timeZone: 'America/Los_Angeles' });
}

function AMDecider() {
  var amString = 'AM';
  var pmString = 'PM';

  var boolTime = new Date().toLocaleTimeString({timeZone: 'America/Los_Angeles' });
  var isAM = boolTime.includes(amString);
  var isPM = boolTime.includes(pmString);
  return isAM;
}

function todaysDate() {
  var date = new Date();
  var format = "YYYY-MMM-DD DDD";
  return dateConvert(date,format);
}

function dateConvert(dateobj,format){
  var year = dateobj.getFullYear();
  var month= ("0" + (dateobj.getMonth()+1)).slice(-2);
  var date = ("0" + dateobj.getDate()).slice(-2);
  var hours = ("0" + dateobj.getHours()).slice(-2);
  var minutes = ("0" + dateobj.getMinutes()).slice(-2);
  var seconds = ("0" + dateobj.getSeconds()).slice(-2);
  var day = dateobj.getDay();
  var months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  var dates = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
  var converted_date = "";

  switch(format){
    case "YYYY-MM-DD":
      converted_date = year + "-" + month + "-" + date;
      break;
    case "YYYY-MMM-DD DDD":
      converted_date = year + "-" + months[parseInt(month)-1] + "-" + date + " " + dates[parseInt(day)];
      break;
  }

  return converted_date;
}

module.exports = router;
