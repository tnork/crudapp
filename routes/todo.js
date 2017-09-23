const express = require('express');
const router = express.Router();
var url = require('url');
const methodOverride = require('method-override');
const dateFormat = require('dateformat');

const uuid = require('uuid');
const uuidv4 = require('uuid/v4');

const mongoose = require('mongoose')
  , Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
const todos = require('../models/todos');
const Todos = require('mongoose').model('Todos');

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

// Validation for New Todo (Is already required field in view template anyway), returns true if valid
function validTodo(todo) {
  return typeof todo.title == 'string' && typeof todo.title.trim() != '' && typeof todo.priority == 'number';
}

function lookupDescription(id) {
  mongoose.model('Todos').findOne({uuid: id}, (err, doc) => {
    if(!err){
      console.log(doc.description);
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
  var currentDate = new Date().toLocaleTimeString('en-US', { hour12: true,
                                             hour: "numeric",
                                             minute: "numeric"});
  return currentDate;
}

function todaysDate(){
  var today = new Date().toLocaleDateString(undefined, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  return today;
}

module.exports = router;
