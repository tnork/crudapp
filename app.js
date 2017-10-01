const express = require('express');
const request = require('request');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs');
const uuid = require('uuid');
const uuidv4 = require('uuid/v4');
const methodOverride = require('method-override');
const hbs = require('hbs');
require('handlebars-form-helpers').register(hbs.handlebars);
const session = require('express-session');
const passport = require('passport');
const ExpressValidator = require('express-validator');
const LocalStrategy = require('passport-local').Strategy;
const multer = require('multer');
const upload = multer({dest: './uploads'});
const flash = require('connect-flash');
const mongo = require('mongodb');
const keys = require('./config/keys');
const mongoose = require('mongoose')
  , Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
const db = require('./config/db');
const port = '5000' || process.env.NODE_ENV;3

// Models
const models_path = __dirname + '/models';
fs.readdirSync(models_path).forEach(function (file) {
  require(models_path+'/'+file);
});

// Routes
const index = require('./routes/index');
const users = require('./routes/users');
const todo = require('./routes/todo');
const groups = require('./routes/groups');

var app = express();

// HBS View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Allows Selected Priority on Edit View to Default to Previous
hbs.registerHelper('select', function(selected, options) {
  return options.fn(this).replace(
    new RegExp(' value=\"' + selected + '\"'),
    '$& selected="selected"');
});

// Handlebars.registerHelper('iff', function(a, operator, b, opts) {
//     var bool = false;
//     switch(operator) {
//        case '==':
//            bool = a == b;
//            break;
//        case '>':
//            bool = a > b;
//            break;
//        case '<':
//            bool = a < b;
//            break;
//        default:
//            throw "Unknown operator " + operator;
//     }
//
//     if (bool) {
//         return opts.fn(this);
//     } else {
//         return opts.inverse(this);
//     }
// });

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// Handle Sessions
app.use(session({
  secret: keys.secret,
  saveUninitialized: true,
  resave: true
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Validator
app.use(ExpressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect-Flash
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Route Mounts
app.use('/', index);
app.use('/users', users);
app.use('/groups', todo);
app.use('/todos', todo);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
  console.log('Server started on port ' + port);
});

module.exports = app;
