const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users');

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done) {
    process.nextTick(function() {
      User.findOne({ 'local.email':  email }, function(err, user) {
        if (err)
            return done(err);
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {
          var newUser = new User();
          newUser.local.dateJoin = todaysDate();
          newUser.local.email = email;
          newUser.local.password = newUser.generateHash(password);
          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, email, password, done) {
    User.findOne({ 'local.email':  email }, function(err, user) {
      if (err)
          return done(err);
      if (!user)
          return done(null, false, req.flash('loginMessage', 'No user found.'));
      if (!user.validPassword(password))
          return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
      return done(null, user);
    });
  }));

};

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
