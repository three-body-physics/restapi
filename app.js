var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");
var port = process.env.PORT || 3000
var passport = require("passport");

// var allowCrossDomain = function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

//     // intercept OPTIONS method
//     if ('OPTIONS' == req.method) {
//       res.send(200);
//     }
//     else {
//       next();
//     }
// };

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(passport.initialize());


app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());


app.set("views", path.join(__dirname, "backend", "views"));
app.set("view engine", "ejs");

app.use(express.static("./public"));

var routes = require("./backend/routes/router");
app.use("/", routes);

var server = require('http').Server(app).listen(port);
