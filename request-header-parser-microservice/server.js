let express = require('express');
let app = express();

app.get('/', (req, res) => {
  res.send('Hello There !. go to /api/whoami');
});

app.get('/api/whoami', (req, res) => {
  let ipaddress = req.headers['x-forwarded-for'].split(',')[0];
  let language = req.headers['accept-language'];
  let software = req.headers['user-agent'];
  res.send({ipaddress, language, software});
});

let PORT = '8080';
var listener = app.listen(PORT, () => {
  console.log('Your app is running on ' + PORT);
});
