const express = require("express");
const { Deta } = require('deta');
var multer = require('multer');
var upload = multer();

const deta = Deta();
// Declaring all the databases we need
const users = deta.Base("users");
const helpboards = deta.Base("helpboards");
const questions = deta.Base("questions");

const app = express(); 

// for parsing application/json
app.use(express.json()); 

// for parsing application/xwww-
app.use(express.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));

app.get("/", async (req, res) => {
  res.send("Helpboard API Server | Version 3 | Powered by Deta.sh, Made by Brenden2008")
});

app.post('/', function(req, res){
  res.send(req.body);
});

module.exports = app;
