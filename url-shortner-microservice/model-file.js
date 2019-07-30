var mongoose = require('mongoose');

var counterSchema = new mongoose.Schema({
  _id: {type: String, required: true},
  count: {type: Number, default: 0},
});

var Counter = mongoose.model('counter', counterSchema);

var urlSchema = new mongoose.Schema({
  _id: {type: Number},
  url: '',
  created_at: '',
});

urlSchema.pre('save', function(next) {
  var doc = this;
  Counter.findByIdAndUpdate({_id: 'url_count'}, {$inc: {count: 1}}, function(
    err,
    counter,
  ) {
    if (err) console.log(err);
    console.log(counter.count);
    doc._id = counter.count;
    doc.created_at = new Date();
    next();
  });
});

var URL = mongoose.model('URL', urlSchema);

module.exports = {
  Counter,
  URL,
};
