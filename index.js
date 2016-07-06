var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

require('./lib/connection');
var employees = require('./routes/employees');
var teams = require('./routes/teams');

var app = express();

//app.use(favicon(__dirname + '/public/favicon/ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app routes
app.use(employees);
app.use(teams);

//catch 404 and forward to error handler
app.use(function(req,res,next) {
  var err = new Error('Not Found');

  err.status = 404;
  next(err);
});

// error handlers

//dev err handler to print stack trace
if (app.get('env') === 'development') {
  app.use(function(err, req,res,next) {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err
    });
  });
}

//prod err handler no stack trace
app.use(function(err,req,res,next) {
  res.status(err.status || 500);
});

module.exports = app;

console.log('Server running at http://127.0.0.1:1337/');