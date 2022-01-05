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
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function checkauthkey(authkey) {
  try {
    if (Date.now() - authkeys.get(authkey).issuetime >= 7200000){
      authkeys.delete(authkey)
      return {validkey: 0};
    } else {
      return {validkey: 1, username: authkeys.get(authkey).username};
    }
  } catch (error){
    return {success: 0, err: "The authkey provided was more than likely invalid. Happens if you run a non-active key twice."}
  }
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
        var issuetime = Date.now();
        authkeys.put({username: req.body.username, authkey: authkey, issuetime: issuetime}, authkey)
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

app.post('/user/auth', function(req, res){
  if (users.get(req.body.username) != null && users.get(req.body.username).password == req.body.password){
    res.send({success: 0, err: "Failed to authenticate user, Username does not already exist or incorrect password.", errcode: 11});
  } else {
    try {
      var authkey = makeid(256)
      authkeys.put({username: req.body.username, authkey: authkey}, authkey)
      res.cookie('auth', authkey, {maxAge: 10800}).send({success: 1, statuscode: 101})
    } catch (error) {
      res.send({success: 0, err: error, errcode: 00})
    }
  };
});

app.post('/user/logout', function(req, res){
  await authkeys.delete(req.cookies.auth);
  res.send({success: 1});
});

module.exports = app;
