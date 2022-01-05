const express = require("express");
const { Deta } = require('deta');
var multer = require('multer');
var upload = multer();
var cookieParser = require('cookie-parser');
const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.auth0key,
  baseURL: 'https://hbv3-dev.deta.dev',
  clientID: 'pExK4AD4X4wNZFtNWthbVpD0budOK2Kf',
  issuerBaseURL: 'https://boardapps.us.auth0.com'
};

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

const deta = Deta();
// Declaring all the databases we need
const helpboards = deta.Base("helpboards");
const questions = deta.Base("questions");

const app = express(); 

app.use(express.json()); 
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); 
app.use(upload.array()); 
app.use(express.static('public'));
app.use(auth(config));

// Just sayin what we are!
app.get("/", async (req, res) => {
  res.send("Helpboard API Server | Version 3 | Powered by Deta.sh, Made by Brenden2008");
});

// Test Route For Checking Your OIDC Profile.
app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user.email));
});

app.post('/helpboard/create', requiresAuth(), (req, res) => {
  const helpboard_id = getRndInteger(111111111, 999999999)
  const helpboard_insert = helpboards.insert({helpboard_id: helpboard_id, helpboard_owner: req.oidc.user.email}, helpboard_id)
});

module.exports = app;
