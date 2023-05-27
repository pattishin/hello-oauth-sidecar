/* eslint-disable */
import request from 'request';
import express from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import cors from 'cors';
import querystring from 'querystring';
import cookieParser from 'cookie-parser';
import {
  CLIENT_ID,
  JWT_SECRET,
  CLIENT_SECRET,
  COOKIE_NAME,
  REDIRECT_URI,
  SITE_URL,
} from './config.js';

const port = 3000;
const redirectURI = '/auth/google';
const app = express();

function getTokens({ code, clientId, clientSecret, redirectUri }) {
  const url = 'https://oauth2.googleapis.com/token';
  const values = {
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  };

  const options = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  return axios
    .post(url, querystring.stringify(values), options)
    .then(res => {
      return res?.data;
    })
    .catch(err => {
      console.error(`Failed to fetch auth tokens`);
      throw new Error(err.message);
    });
}

/**
 * Applying CORS
 * 
 * Origin: applies access-control-allow-origin to client app
 * Client: applies access-control-allow-credentials to true
 * For more information: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
 */
app.use(
  cors({
    origin: SITE_URL,
    credentials: true,
  })
);

app.use(cookieParser());

/**
 * Handles Auth Callback
 * For more information: https://developers.google.com/identity/protocols/oauth2/web-server
 */
app.get(`${redirectURI}`, async (req, res) => {
  const code = req.query.code;

  const { id_token, access_token } = await getTokens({
    code,
    clientId: '821070197892-3s4m3nbfg4d5bmu30anpnbe3muo0ure5.apps.googleusercontent.com', //CLIENT_ID
    clientSecret: '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', //CLIENT_SECRET,
    redirectUri: `https://hello-spa-oauth-sandbox-3cbd2kmgtq-uc.a.run.app/callback`,
  });

  const userURL = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`;
  const options = {
    credentials: true,
    headers: {
      Authorization: `Bearer ${id_token}`,
    },
  };

  const user = await axios
    .get(userURL, options)
    .then(res => res.data)
    .catch(err => {
      throw new Error(err.message);
    });

  const token = jwt.sign(user, 'foobar'); //JWT_SECRET

  res.cookie('authtoken', token, { //COOKIE_NAME
    maxAge: 900000,
    httpOnly: true,
    secure: false,
  });*/

  res.send("Cookie Set");

  /*return axios({
    method: 'get',
    url: 'http://localhost:8000/',
    responseType: 'stream'
  })
  .catch(err => {
    res.send('Error: Not reachable at the moment on localhost.');
  })
  .then(function (response) {
    response.data.pipe(res);
  });*/
});

/**
 * Retrieve logged in user profile
 */
app.get('/getUser', (req, res) => {
  let user;

  try {
    const cookie = req.cookies[COOKIE_NAME];
    user = jwt.verify(cookie, JWT_SECRET);
  } catch (err) {
    throw new Error(err);
  }

  return res.send(user);
});

/**
 * Check for auth cookie
 */
app.get('/hasCookie', (req, res) => {
  let cookie;

  try {
    cookie = req.cookies[COOKIE_NAME];
  } catch (err) {
    throw new Error(err);
  }

  return res.send(!!cookie);
});

/*app.get('/foobar', async (req, res) => {
  console.log('------ foobar');
  
  axios({
    method: 'get',
    url: 'http://localhost:3000/hello',
    responseType: 'stream'
  })
  .catch(err => {
    res.send('Not reachable at the moment on localhost.');
  })
  .then(function (response) {
    response.data.pipe(res);
  });
});*/

/**
 * Handle auth logout
 */
app.get('/logout', (req, res) => {
  try {
    if (!!req.cookies[COOKIE_NAME]) {
      res.clearCookie(COOKIE_NAME);
    }
  } catch (err) {
    throw new Error(error.message);
  }

  res.send('logout completed');
});

app.listen(port, () => {
  console.log(`Auth api server listening http://localhost:${port}`);
});
/* eslint-enable */
