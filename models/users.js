var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersSchema = mongoose.Schema({
    name: String,
    title:  String,
    priority: Number,
    description: String,
    done: Boolean,
    date: Date,
    todoId: Number
});

  var Users = mongoose.model('Users', usersSchema);

  // var tyler = new Users({
  //   name: 'Tyler Norkus',
  //   title:  'First Task',
  //   priority: 1,
  //   description: 'Git R Done',
  //   done: false,
  //   date: Date.now(),
  //   todoId: 2
  // });

  // tyler.save(function(err) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log('Woof');
  //   }
  // });
