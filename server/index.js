const express = require("express");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");
require('dotenv').config()
const rootRouter = require("./routes");

var app = express();
app.use(cors());

app.set('port', process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../", "build")));
app.use("/api", rootRouter);
app.get("/**", function (req, res) {
  res.sendFile(path.join(__dirname, "../", "build", "index.html"));
});

app.listen(app.get('port'), err => {
  if (err) {
    return console.log(err.message);
  }
  console.log('Listening to ... ' + app.get('port'));
});

module.exports = app;
