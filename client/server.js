
const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');

const app = express();

const port = 8000;

// Enable CORS
app.use(cors());

app.use(express.static(path.join(__dirname, 'build')));

app.get('/logout', (req, res) => {
  res.send('logout');
});

app.get('/callback', (req, res) => {
  res.cookie('test', 'one');
  console.log('---- starting callback');
  const query = req.url.substr(req.url.indexOf('?') + 1);

  axios({
    method: 'get',
    url: `http://localhost:3000/auth/google?${query}`,
    responseType: 'stream'
  })
  .catch(err => {
    res.send('Error: Not reachable at the moment on localhost. Possible error occurred in auth server.');
  })
  .then(function (response) {
    response?.data.pipe(res);
  });
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
   console.log(`Backend server listening http://localhost:${port}`);
});
