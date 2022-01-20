const express = require("express");
const { Deta } = require('deta');
var multer = require('multer');
var upload = multer();
var cookieParser = require('cookie-parser');
const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');
var crypto = require("crypto");

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.auth0key,
  baseURL: 'https://hbv3.deta.dev/',
  clientID: 'pExK4AD4X4wNZFtNWthbVpD0budOK2Kf',
  issuerBaseURL: 'https://boardapps.us.auth0.com'
};

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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
app.use('/static', express.static('static'))

// Just sayin what we are!
app.get("/", async (req, res) => {
  res.send("Helpboard API Server | Version 3 | Powered by Deta.sh, Made by Brenden2008");
});

// Test Route For Checking Your OIDC Profile.
app.get('/profile', requiresAuth(), async (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

// Create Helpboard
app.get('/helpboard/create', requiresAuth(), async (req, res) => {
  var helpboard_id = getRndInteger(111111111, 999999999).toString();
  try {
    helpboards.insert({ helpboard_id: helpboard_id, helpboard_owner: req.oidc.user.email, helpboard_active: true, key: helpboard_id });
  } catch {
    res.send({ success: 0, err: 'Helpboard creation failed. Please try again.' })
  } finally {
    res.send(JSON.stringify({ success: 1, helpboard_id: helpboard_id, helpboard_owner: req.oidc.user.email, helpboard_active: true }));
  }
});

// Delete Helpboard
app.post('/helpboard/delete', requiresAuth(), async (req, res) => {
  try {
    var helpboard_id = req.body.helpboard_id
    var email = req.oidc.user.email
    var helpboard = helpboards.get(helpboard_id);
    helpboard.then((data) => {
      if (data.helpboard_owner == email) {
        helpboards.delete(helpboard_id);
        res.send({ success: 1 })
      } else {
        res.send({ success: 0, err: 'Helpboard deletion failed. Not your helpboard.' })
      };
    });
  } catch {
    res.send({ success: 0, err: 'Helpboard deletion failed. Please try again.' })
  };
});

// Get a helpboard
app.post('/helpboard/get', requiresAuth(), async (req, res) => {
  try {
    var helpboard_id = req.body.helpboard_id;
    var email = req.oidc.user.email;
    var helpboard = helpboards.get(helpboard_id);
    helpboard.then((data1) => {
      if (email == data1.helpboard_owner) {
        res.send({ success: 1, helpboard_id: data1.helpboard_id, helpboard_owner: data1.helpboard_owner, helpboard_active: data1.helpboard_active })
      } else {
        res.send("{success: 0, err: 'Not your helpboard.'}")
      }
    })
  } catch {
    res.send("{success: 0}")
  }
});

// Add a question
app.post('/question/add', requiresAuth(), async (req, res) => {
  try {
    var helpboard_id = req.body.helpboard_id;
    var question = req.body.question;
    var nickname = req.oidc.user.nickname;
    var email = req.oidc.user.email;
    var idgen = crypto.randomBytes(20).toString('hex');
    var id = idgen;
    var dbquestion = questions.put({ nickname: nickname, question: question, email: email, helpboard: helpboard_id, question_id: id }, id);
    res.send({ success: 1, question_id: id })
  } catch {
    res.send("{success: 0}")
  }
});

// Get a question
app.post('/question/get', requiresAuth(), async (req, res) => {
  try {
    var helpboard_id = req.body.helpboard_id;
    var email = req.oidc.user.email;
    var id = req.body.question_id;
    var dbquestion = questions.get(id);
    var helpboard = helpboards.get(helpboard_id);
    dbquestion.then((data) => {
      helpboard.then((data1) => {
        if (email == data1.helpboard_owner || data.email == email) {
          res.send({ success: 1, nickname: data.nickname, question: data.question, email: data.email, helpboard: data.helpboard, question_id: data.question_id })
        } else {
          res.send("{success: 0, err: 'Not your helpboard, or question.'}")
        }
      })
    });
  } catch {
    res.send("{success: 0}")
  }
});

// Delete a question
app.post('/question/delete', requiresAuth(), async (req, res) => {
  try {
    var helpboard_id = req.body.helpboard_id;
    var email = req.oidc.user.email;
    var id = req.body.question_id;
    var dbquestion = questions.get(id);
    var helpboard = helpboards.get(helpboard_id);
    dbquestion.then((data) => {
      helpboard.then((data1) => {
        if (email == data1.helpboard_owner) {
          questions.delete(id);
          res.send("{success: 1}")
        } else {
          res.send("{success: 0, err: 'Not your helpboard.'}")
        }
      })
    });
  } catch {
    res.send("{success: 0}")
  }
});

// List questions
app.post('/question/all', requiresAuth(), async (req, res) => {
  try {
    var helpboard_id = req.body.helpboard_id;
    var email = req.oidc.user.email;
    var dbquestion = await questions.fetch({ "helpboard": helpboard_id });
    var helpboard = await helpboards.get(helpboard_id);
    if (email == helpboard.helpboard_owner) {
      var question_list = [];
      for (let index = 0; index < dbquestion.count; ++index) {
        var element = dbquestion.items[index];
        question_list.push(element);
      }
      res.send(question_list);
    } else {
      res.send("{success: 0, err: 'Not your helpboard.'}");
    };
  } catch (err) {
    res.send("{success: 0}");
    console.log(err);
  }
});

module.exports = app;
