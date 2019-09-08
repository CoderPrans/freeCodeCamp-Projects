'use strict'

let express = require('express');
let mongo = require('mongodb');
let mongoose = require('mongoose');
let middleware = require('./middleware');

let app = express();

mongoose
  .connect("mongodb://pranav:pranav123@ds149606.mlab.com:49606/exercise-tracker")
  .then(console.log("DB Connected"))
  .catch(err => console.log(err));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

app.use('/api/exercise', middleware);

let port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log('Node.js listening ...');
});
