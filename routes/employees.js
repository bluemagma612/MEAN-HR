var express = require('express');
var mongoose = require('mongoose');
var Employee = mongoose.model('Employee');
var Team = mongoose.model('Team');
var router = express.Router();

router.get('/employees', function(req,res) {
	Employee.find().sort('name.last').exec(function(err, results) {
		if (err) {
			return next(err);
		}

		//Respond with valid data
		res.json(results);
	});
});

router.get('/employees/:employeeId', function(req,res) {
	console.log("employeeId:" + req.params.employeeId);
	Employee.findOne({
		empId: req.params.employeeId
	}).populate('team').exec(function (err, results) {
		if (err) {
			return next(err);
		}

		//if no user found return 404
		if (!results) {
			res.send(404);
		}

		//respond with valid json data
		res.json(results);
	});
});

router.delete('/employees/:employeeId', function(req,res) {
	Employee.remove({ empId: req.params.employeeId }).exec(function(err,results) {
		if (err) {
			return next(err);
		} else {
			Employee.find().sort('name.last').exec(function(err, results) {
			if (err) {
				return next(err);
			}

			//Respond with remaining employees
			res.json(results);
			});
		};
	});
});

router.post('/employees', function(req,res,next) {
	var employee = new Employee();
	employee.empId = req.body.empId;
	employee.name.first = req.body.firstName;
	employee.name.last = req.body.lastName;

	employee.save(function(err,results) {
		if (err) {
			console.log(err);
			return next(err);
		} 
		res.json(results);
	});
});

router.put('/employees/:employeeId', function(req,res) {
	//remove this or mongoose will throw an error
	//because we would be trying to update the mongoid
	delete req.body._id;
	req.body.team = req.body.team._id

	Employee.update({
		empId: req.params.employeeId
	}, req.body, function(err, numberAffected, response) {
		if (err) {
			return next(err);
		}
		res.send(200);
	});
});

module.exports = router;