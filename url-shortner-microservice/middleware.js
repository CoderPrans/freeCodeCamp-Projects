var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: true}));

var {Counter, URL} = require('./model-file');

router.get('/count', function(req, res) {
  Counter.find({}, function(err, counter) {
    res.send(counter);
  });
});

router.post('/new', function(req, res) {
  URL.findOne({url: req.body.url}, function(err, doc) {
    if (doc) {
      console.log('entry found in db');
      res.send({
        original_url: doc.url,
        short_url: doc._id,
      });
    } else {
      console.log('entry not found in db, creating new..');
      var url = new URL({
        url: req.body.url,
      });
      url.save(function(err, doc) {
        if (err) {
          console.log(err);
        }
        res.send({
          original_url: doc.url,
          short_url: doc._id,
        });
      });
    }
  });
});

router.get('/:id', function(req, res) {
  URL.findOne({_id: req.params.id}, function(err, doc) {
    if (doc) {
      res.redirect(doc.url);
    } else {
      res.redirect('/');
    }
  });
});

module.exports = router;
