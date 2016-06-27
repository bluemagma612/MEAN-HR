var express = require('express');
var app = express();

//Route one
app.get('/teams/:teamName/employees/:employeeId', function (req, res, next) {
	console.log('team name = ' +req.params.teamName);
	console.log('employeeid = ' +req.params.employeeId);
	res.send('path one');
});

//Route two
app.get('/teams/:teamName/employees', function(res,req,next) {
	console.log('setting content type');
	res.set('Content-Type', 'application/json');
	res.locals.data = 100;
	next();
	}, function (res, req, next) {
	console.log('teamName = ' +req.params.teamName);
	console.log(res.locals.data);
	res.send('path two');
});

//Route three
app.get(/^\/groups\/(\w+)\/(\d+)$/, function (req,res,next) {
	console.log('groupname = ' + req.params[0]);
	console.log('groupId = ' + req.params[1]);
	res.send('path three');	
});

var server = app.listen(1337, function() {
	console.log('Server started on http://127.0.0.1:1337');
});