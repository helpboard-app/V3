const express = require("express");
const { Deta } = require('deta');
var multer = require('multer');
var upload = multer();
var cookieParser = require('cookie-parser');

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

app.get("/", async (req, res) => {
  res.send("Helpboard API Server | Version 3 | Powered by Deta.sh, Made by Brenden2008")
});

module.exports = app;
