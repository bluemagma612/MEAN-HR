var async = require('async');
var mongoose = require('mongoose');
require(process.cwd() + '/lib/connection');
var Employee = mongoose.model('Employee');
var Team = mongoose.model('Team');
var User = mongoose.model('User');

var data = {
	employees: [
	{
		empId: '1000003',
		name: {
			first: 'Colin',
			last: 'Ihrig'
		},
		image: '/assets/images/employees/1.jpg',
		address: {
			lines: ['11 Wall Street'],
			city: 'New York',
			state: 'NY',
			zip: 10118
			}
		},
		{
		empId: '1000021',
		name: {
			first: 'Adam',
			last: 'Bretz'
		},image: '/assets/images/employees/2.jpg',
		address: {
			lines: ['46 18th St', 'St. 210'],
			city: 'Pittsburgh',
			state: 'PA',
			zip: 15222
			}
		},
		{
		empId: '1000022',
		name: {
			first: 'Matt',
			last: 'Liegey'
		}, image: '/assets/images/employees/3.jpg',
		address: {
			lines: ['2 S Market Square', '(Market Square)'],
			city: 'Pittsburgh',
			state: 'PA',
			zip: 15222
			}
		},
		{
		empId: '1000025',
		name: {
			first: 'Aleksey',
			last: 'Smolenchuk'
		},image: '/assets/images/employees/4.jpg',
		address: {
			lines: ['3803 Forbes Ave'],
			city: 'Pittsburgh',
			state: 'PA',
			zip: 15213
			}
		},
		{
		empId: '1000030',
		name: {
			first: 'Sarah',
			last: 'Gay'
		},image: '/assets/images/employees/5.jpg',
		address: {
			lines: ['8651 University Blvd'],
			city: 'Pittsburgh',
			state: 'PA',
			zip: 15108
			}
		},
		{
		empId: '1000031',
		name: {
			first: 'Dave',
			last: 'Beshero'
		},image: '/assets/images/employees/6.jpg',
		address: {
			lines: ['1539 Washington Rd'],
			city: 'Mt Lebanon',
			state: 'PA',
			zip: 15228
			}
		}
	],
	teams: [
	{
		name: 'Software and Services Group'
	},
	{
		name: 'Project Development'
	}
	],
	users: [
	{
		username: 'bluemagma',
		password: 'bryc3b',
		name: 'Bryce',
		admin: true
	}
	]
};

var deleteEmployees = function(callback) {
	console.info('Deleting employees');
	Employee.remove({}, function(error, response) {
		if (error) {
	console.error('Error deleting employees: ' + error);
	}
		console.info('Done deleting employees');
		callback();
	});
};
var addEmployees = function(callback) {
	console.info('Adding employees');
	Employee.create(data.employees, function (error) {
	if (error) {
		console.error('Error adding employees: ' + error);
	}
		console.info('Done adding employees');
		callback();
	});
};
var deleteTeams = function(callback) {
	console.info('Deleting teams');
	Team.remove({}, function(error, response) {
	if (error) {
		console.error('Error deleting teams: ' + error);
	}
		console.info('Done deleting teams');
		callback();
	});
};
var addTeams = function(callback) {
	console.info('Adding teams');
	Team.create(data.teams, function (error, team) {
	if (error) {
		console.error('Error: ' + error);
	} else {
		//console.log("team "+team[0]._id);
		//in the text and doesnt work!
		//data.team_id = team1._id;
		data.team_id = team[0]._id;
		
	}
		console.info('Done adding teams');
		callback();
	});
};
var updateEmployeeTeams = function(callback) {
	console.info('Updating employee teams');
	var team = data.teams[0];
	//console.log("team id " + team_id + " team name " +team.name);
	// Set everyone to be on the same team to start
	Employee.update({}, {
	team_id: data.team_id
	}, {
	multi: true
	}, function (error, numberAffected, response) {
	if (error) {
		console.error('Error updating employe team: ' + error);
	}
		console.info('Done updating employee teams');
		callback();
	});
};
var addUsers = function(callback) {
	console.info('adding users');
	User.create(data.users, function(error) {
		if (error) {
			console.error('Error adding users: ' + error);
		}
		console.info('Done adding users');
		callback();
	});
};

async.series([
	deleteEmployees,
	deleteTeams,
	addEmployees,
	addTeams,
	addUsers,
	updateEmployeeTeams
], function(error, results) {
	if (error) {
	console.error('Error: ' + error);
	}
	mongoose.connection.close();
	console.log('Done!');
});