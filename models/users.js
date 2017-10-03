const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = mongoose.Schema({
    username: {
      type: String,
      index: true
    },
    password: String,
    email:  String,
    name: String,
    profileImage: String
});

const Users = module.exports = mongoose.model('Users', usersSchema);

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
