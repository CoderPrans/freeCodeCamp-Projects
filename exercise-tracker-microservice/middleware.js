let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: true}));

let {User, Exercise} = require('./model');

// adding user
router.post('/new-user', function(req, res) {
  User.findOne({username: req.body.username}, function(err, doc){
    if(doc){
      res.send("username already taken")
    } else {
      let user = new User({
        username: req.body.username
      })
      user.save(function(err, doc){
        if(err){console.log(err)};
        res.send({
          username: doc.username
        })
      })
    }
  })
});

// adding exercise
router.post('/add', function(req, res){
  User.findOne({username: req.body.username}, function(err, doc){
    if(doc) {
      let exercise = new Exercise({...req.body, date: formatDate(req.body.date)})
      exercise.save((err, savedExercise) => {
        if(err) console.log(err)
        savedExercise = savedExercise.toObject()
        res.json(savedExercise);
      })
    }
    else {
      res.send("no user found, check the username")
    }
  })
})

function formatDate(date){
  let dateArr = date.split('-');
  return new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
}

// querying log
router.get('/log', function(req, res){
  let {username, limit} = req.query;
  let to = new Date(req.query.to);
  let from = new Date(req.query.from);
  if(username){
  User.findOne({username: username}, function(err, doc){
    if(err) console.log(err);
    let exercises = Exercise.find({
      username: doc.username,
      date: {
          $lt: to != 'Invalid Date' ? to.getTime() : Date.now() ,
          $gt: from != 'Invalid Date' ? from.getTime() : 0
        }
    })
    .sort('-date')
    .limit(parseInt(limit))
    .exec((err, exercises) => {
      let out = {
        username: doc.username,
        from : from != 'Invalid Date' ? from.toDateString() : undefined,
          to : to != 'Invalid Date' ? to.toDateString(): undefined,
          count: exercises.length,
          log: exercises.map(e => ({
            description : e.description,
            duration : e.duration,
            date: e.date.toDateString()
          })
        )        
      }
      res.json(out);
    })
  })
}
})

module.exports = router;



