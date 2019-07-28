const express = require('express');
const app = express();

const timestamp = require('./timestamp');

const port = 5000;
const host = 'https://localhost';

app.get('/', (req, res) =>
  res.send(
    'This is a node api and microservices project \n made for freeCodeCap full stack certification course.',
  ),
);

app.use('/api/timestamp', timestamp);

app.listen(port, () => console.log(`listening on port ${host}:${port}`));
