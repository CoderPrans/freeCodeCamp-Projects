let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  username: {type: String, require: true}
})

let exerciseSchema = new mongoose.Schema({
  username: {type: String, require: true},
  date: {type: Date, default: Date.now}, 
  description: String, 
  duration: String
})

let User = mongoose.model('User', userSchema);
let Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = { User, Exercise }
