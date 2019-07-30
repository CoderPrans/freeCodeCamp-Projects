var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var {Counter} = require('./model-file');
var middleware = require('./middleware');
var path = require('path');

var app = express();

var port = process.env.PORT || 3000;

mongoose
  .connect(
    'mongodb://pranav:pranav123@ds157422.mlab.com:57422/url-shortner-microservice',
  )
  .then(() => {
    console.log('DB connected');
    Counter.find({}, function(err, counter) {
      if (!counter.length) {
        var counter = new Counter({
          _id: 'url_count',
          count: 0,
        });
        counter.save(function(err) {
          if (err) console.log(err);
          console.log('counter created....');
        });
      }
      console.log(counter);
    });
  })
  .catch(err => console.log(err));

// app.use(cors());

app.use('/api/shorturl', middleware);

// app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, './index.html'));
});

app.get('/api/hello', function(req, res) {
  res.json({greeting: 'hello API'});
});

app.listen(port, function() {
  console.log('Node.js listening ...');
});
