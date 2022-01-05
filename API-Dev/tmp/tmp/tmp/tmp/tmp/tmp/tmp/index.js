const express = require("express");
const { Deta } = require('deta');
var multer = require('multer');
var upload = multer();
var cookieParser = require('cookie-parser');
const { auth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.auth0key,
  baseURL: 'https://hbv3-dev.deta.dev',
  clientID: 'pExK4AD4X4wNZFtNWthbVpD0budOK2Kf',
  issuerBaseURL: 'https://boardapps.us.auth0.com'
};

const deta = Deta();
// Declaring all the databases we need
// const users = deta.Base("users");
// const authkeys = deta.Base("authkeys");
const helpboards = deta.Base("helpboards");
const questions = deta.Base("questions");

const app = express(); 

app.use(express.json()); 
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); 
app.use(upload.array()); 
app.use(express.static('public'));
app.use(auth(config));

app.get("/", async (req, res) => {
  res.send("Helpboard API Server | Version 3 | Powered by Deta.sh, Made by Brenden2008")
});

app.get('/authcheck', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

module.exports = app;
