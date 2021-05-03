  
const config = require('./config');
const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const { videoToken } = require('./tokens');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(pino);

const sendTokenResponse = (token, res) => {
  res.set('Content-Type', 'application/json');
  res.send(
    JSON.stringify({
      token: token.toJwt()
    })
  );
};

app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/json');

  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

app.get('/video/token', (req, res) => {
  const identity = req.query.identity;
  const room = req.query.room;
  const token = videoToken(identity, room, config);
  sendTokenResponse(token, res);
});

app.post('/video/token', (req, res) => {
  // request who is asking & to whom he/she is asking
  // get relationship
  // establish connection
  // otherwise connection possible hudaina

  const identity = req.body.identity;
  const room = req.body.room;

  try {
    const token = videoToken(identity, room, config);
  
    sendTokenResponse(token, res);
  } catch(e) {
    console.log(e)
  }
});

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), () =>
console.log(`Express server is running on port ${app.get('port')}`)
);