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
const mongoose = require('mongoose');
const hbs = require('hbs');
require('handlebars-form-helpers').register(hbs.handlebars);
const port = '5000' || process.env.NODE_ENV;

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
