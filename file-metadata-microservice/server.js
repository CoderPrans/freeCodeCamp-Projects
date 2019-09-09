let express = require('express')
let multer = require('multer')

let app = express()

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html')
})

app.post('/api/fileanalyse',multer().single('upfile'), function(req, res){
  let {originalname, size, mimetype} = req.file
  res.json({name: originalname, type: mimetype, size: `${size/1000} kB`})
})

let PORT = process.env.PORT || 3000

app.listen(PORT, function() {
  console.log(`Node.js listening on port ${PORT}`)
})
