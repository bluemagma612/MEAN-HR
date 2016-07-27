var express = require('express'),
  app = express(),
  path = require('path'),
  favicon = require('serve-favicon'),
  morgan = require('morgan'), // used to see requests
  cookieParser = require('cookie-parser'),
  config = require('./config'),
  bodyParser = require('body-parser');

require('./lib/connection');

//app.use(favicon(__dirname + '/public/favicon/ico'));

// log all requests to the console
app.use(morgan('dev'));

// use body-parser so we can grab information about POST requests
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

//configure our app to handle CORS requests
app.use(function(req,res,next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
  next();
});

app.use(cookieParser());

// set static files location
// userd for requests
app.use(express.static(__dirname + '/public'));

var authRoutes = require('./app/routes/authenticate')(app, express);
app.use('/api', authRoutes);

var usersRoutes = require('./app/routes/users')(app, express);
app.use('/api',usersRoutes);

var employeesRoutes = require('./app/routes/employees')(app, express);
app.use('/api',employeesRoutes);

var teamsRoutes = require('./app/routes/teams')(app, express);
app.use('/api',teamsRoutes);

// basic route for the home page
app.get('*', function(req,res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

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

// //prod err handler no stack trace
app.use(function(err,req,res,next) {
  res.status(err.status || 500);
});

// module.exports = app;

// START THE SERVER
//=====================================================
app.listen(config.port);
console.log('Magic happens on port ' + config.port);