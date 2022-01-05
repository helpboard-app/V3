const express = require("express");

const app = express(); 

app.get("/", async (req, res) => {
  res.send("Helpboard API Server | Version 3")
});

module.exports = app;