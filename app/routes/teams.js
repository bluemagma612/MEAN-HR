// var express = require('express');
// var mongoose = require('mongoose');
// var Employee = mongoose.model('Employee');
var Team = require('../models/team');

module.exports = function(app, express) {

	var teamRouter = express.Router();

	teamRouter.get('/teams', function (req, res, next) {
		Team.find().sort('name').exec(function (error, results) {
			if (error) {
				return next(error);
			}

			//Respond with valid data
			res.json(results);
		});
	});

	teamRouter.get('/teams/:teamId', function (req, res, next) {
		Team.findOne({
			_id: req.params.teamId
		}).populate('team').exec(function (error, results) {
			if (error) {
				return next(error);
			}

			//if no team found return 404
			if (!results) {
				res.send(404);
			}

			//respond with valid json data
			res.json(results);
		});
	});

	teamRouter.put('/teams/:teamId', function (req, res, next) {
		//remove this or mongoose will throw an error
		//because we would be trying to update the mongoid
		delete req.body._id;
		req.body.team = req.body.team._id

		Team.update({
			id: req.params.teamId
		}, req.body, function (err, numberAffected, response) {
			if (err) {
				return next(err);
			}
			res.send(200);
		});
	});

	return teamRouter;
}