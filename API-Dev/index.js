const express = require("express");

const app = express(); 

app.get("/", async (req, res) => {
  res.send("Hello from my Deta Micro")
});

module.exports = app;