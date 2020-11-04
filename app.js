const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.json({ res: "hello world" });
});

app.listen(8080);
