var express = require('express');
var app = express();
var db  = require('./migration');

var port = 4000;

app.listen(port);
console.log("Listening on port", port);