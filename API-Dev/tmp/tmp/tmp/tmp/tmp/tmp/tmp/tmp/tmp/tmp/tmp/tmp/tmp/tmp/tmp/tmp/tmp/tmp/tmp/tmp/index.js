const express = require("express");
const { Deta } = require('deta');
var multer = require('multer');
var upload = multer();
var cookieParser = require('cookie-parser');

const deta = Deta();
// Declaring all the databases we need
const users = deta.Base("users");
const authkeys = deta.Base("authkeys");
const helpboards = deta.Base("helpboards");
const questions = deta.Base("questions");

// Functions
function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}

const app = express(); 

app.use(express.json()); 
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); 
app.use(upload.array()); 
app.use(express.static('public'));

app.get("/", async (req, res) => {
  res.send("Helpboard API Server | Version 3 | Powered by Deta.sh, Made by Brenden2008")
});

app.post('/user/create', function(req, res){
  if (users.get(req.body.username) != null){
    try {
      users.put({username: req.body.username, password: req.body.password}, req.body.username)
      try {
        var authkey = makeid(256)
        authkeys.put({username: req.body.username, authkey: authkey}, authkey)
        res.cookie('auth', authkey).send({success: 1, statuscode: 101})
      } catch (error) {
        res.send({success: 0, err: error, errcode: 00})
      }
    } catch (error) {
      res.send({success: 0, err: error, errcode: 00})
    }
  } else {
    res.send({success: 0, err: "Failed to create user, Username already exists.", errcode: 01});
  };
});

module.exports = app;
