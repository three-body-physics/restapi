var express = require("express");
var app = express();

var path = require("path");
var bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json())


app.set("views", path.join(__dirname, "backend", "views"))
app.set("view engine", "ejs");

app.use(express.static("./public"));

var routes = require("./backend/routes/router");
app.use("/", routes);

var server = require('http').Server(app).listen(3000, "localhost");
