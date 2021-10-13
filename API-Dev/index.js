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
function getCryptoRandomBetween(min, max){
  //the highest random value that crypto.getRandomValues could store in a Uint32Array
  var MAX_VAL = 4294967295;
  
  //find the number of randoms we'll need to generate in order to give every number between min and max a fair chance
  var numberOfRandomsNeeded = Math.ceil((max - min) / MAX_VAL);
  
  //grab those randoms
  var cryptoRandomNumbers = new Uint32Array(numberOfRandomsNeeded);
  crypto.getRandomValues(cryptoRandomNumbers);
  
  //add them together
  for(var i = 0, sum = 0; i < cryptoRandomNumbers.length; i++){
    sum += cryptoRandomNumbers[i];
  }
  
  //and divide their sum by the max possible value to get a decimal
  var randomDecimal = sum / (MAX_VAL * numberOfRandomsNeeded);
  
  //if result is 1, retry. otherwise, return decimal.
  return randomDecimal === 1 ? getCryptoRandomBetween(min, max) : Math.floor(randomDecimal * (max - min + 1) + min);
}

function getRandomChar(str){
  return str.charAt(getCryptoRandomBetween(0, str.length - 1));
}

String.random = function(length, characters) {
  for(var i = 0, str = ""; i < length; i++) str += getRandomChar(characters);
  return str;
};


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
  if (users.get(req.body.username) = null){
    try {
      users.put({username: req.body.username, password: req.body.password}, req.body.username)
      var authkey = String.random(256, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
      try {
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
