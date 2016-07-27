//var express = require('express');
// var mongoose = require('mongoose');
// var Employee = mongoose.model('Employee');
// var Team = mongoose.model('Team');

var Employee = require('../models/employee');

module.exports = function(app, express) {

	var employeesRouter = express.Router();

	employeesRouter.get('/employees', function(req,res, next) {
		Employee.find().sort('name.last').exec(function(err, results) {
			if (err) {
				return next(err);
			}

			//Respond with valid data
			res.json(results);
		});
	});

	employeesRouter.get('/employees/:employeeId', function(req,res, next) {
		Employee.findOne({
			empId: req.params.employeeId
		}).populate('team').exec(function (err, results) {
			if (err) {
				return next(err);
			}

			//if no user found return 404
			if (!results) {
				res.sendStatus(404);
			}

			//respond with valid json data
			res.json(results);
		});
	});

	employeesRouter.delete('/employees/:employeeId', function(req,res, next) {
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

	employeesRouter.post('/employees', function(req,res,next) {
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

	employeesRouter.put('/employees/:employeeId', function(req,res, next) {
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
			res.sendStatus(200);
		});
	});

	return employeesRouter;
}