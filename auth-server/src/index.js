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

const app = express();

// Running on port 3000
const port = 3000;
const redirectURI = '/auth/google';

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

  // TODO: Ensure env vars are coming in as expected
  const { id_token, access_token } = await getTokens({
    code,
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: REDIRECT_URI,
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

  // TODO: Flip to JWT_SECRET env var from 'foobar' 
  const token = jwt.sign(user, 'foobar');

  res.cookie(COOKIE_NAME, token, {
    maxAge: 900000,
    httpOnly: true,
    secure: false,
  });

  res.send("Cookie Set");
});

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
