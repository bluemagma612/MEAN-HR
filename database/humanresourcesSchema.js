var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = mongoose.connection;
var dbUrl = 'mongodb://localhost/humanResources';

var TeamSchema = new Schema({
	name: {
		type: String,
		required: true
	}
});

var Team = mongoose.model('Team', TeamSchema);

var EmployeeSchema = new Schema({
	name: {
		first: {
			type: String,
			required: true
		},
		last: {
			type: String,
			required: true
		}
	},
	team: {
		type: Schema.Types.ObjectId,
		ref: 'Team'
	},
	image: {
		type: String,
		default: 'images/user.png'
	},
	address: {
		lines: {
			type: [String]
		},
		postal: {
			type: String
		}
	}
});

var Employee = mongoose.model('Employee', EmployeeSchema);

db.on('error', function () {
	console.log('there was an error communicating with the damn database');
});

function insertTeams (callback) {
	Team.create({
		name: 'Product Development'
	}, {
		name: 'Dev Ops'
	}, {
		name: 'Accounting'
	}, function (error, pd, devops, acct) {
		if (error) {
			console.error(error);
			return callback(error);
		} else {
			console.info('teams sucessfully added sir!');
			callback(null, pd, devops, acct);			
		}
	});
}

function retrieveEmployee (data, callback) {
	console.log("retrieveEmployee data");
	console.info(data.employee._id);
	Employee.findOne({
		//_id: data.employee._id
		_id: 576ee337918812a71042c6a1
	}).populate('team').exec(function (error, result) {
		if (error) {
			return callback (error);
		} else {
			console.log('*** Single Employee Result ***');
			console.info(result);
			callback(null, data);
		}
	});
}

function retrieveEmployees (data, callback) {
	Employee.find({
		'name.first': /J/i
	}, function (error, results) {
		if (error) {
			return callback(error);
		} else {
			console.log('*** Multiple Employees Result ***');
			console.info(results);
			callback(null, data);
		}
	});
}

function insertEmployees (pd, devops, acct, callback) {
  Employee.create([{
    name: {
      first: 'John',
      last: 'Adams'
    },
    team: devops._id,
    address: {
      lines: ['2 Lincoln Memorial Cir NW'],
      postal: '20037'
    }
  }, {
    name: {
      first: 'Thomas',
      last: 'Jefferson'
    },
    team: pd._id,
    address: {
      lines: ['1600 Pennsylvania Avenue', 'White House'],
      postal: '20500'
    }
  }, {
    name: {
      first: 'James',
      last: 'Madison'
    },
    team: acct._id,
    address: {
      lines: ['2 15th St NW', 'PO Box 8675309'],
      postal: '20007'
    }
  }, {
    name: {
      first: 'James',
      last: 'Monroe'
    },
    team: acct._id,
    address: {
      lines: ['1850 West Basin Dr SW', 'Suite 210'],
      postal: '20242'
    }
  }], function (error, johnadams) {
    if (error) {
      return callback(error);
    } else {
      console.info('employees successfully added sir!');
      callback(null, {
        team: pd,
        employee: johnadams
      });
    }
  })
}

function updateEmployee (first, last, data, callback) {
	console.log('*** Changing name ***');
	//console.dir(data.employee);

	var employee = data.employee;
	employee.name.first = first;
	employee.name.last = last;

	employee.save(function (error, result) {
		if (error) {
			return callback (error);
		} else {
			console.log('*** Changed name to Andrew Jackson ***');
			console.log(result);
			callback(null, data);
		}
	});
}

function removeTeams () {
	console.info("deleting all previously added teams sir!");
	Team.remove({}, function(error, response) {
		if(error) {
			console.error("tried to delete all teams but " + error);
		}
		console.info("done deleting all teams sir!");
	});
}

function removeEmployees () {
	console.info("deleting all previously added employees sir!");
	Employee.remove({}, function(error, response) {
		if(error) {
			console.error("tried to delete all employees but " + error);
		}
		console.info("done deleting all employees sir!");
	});
}

mongoose.connect(dbUrl, function (err) {
	if (err) {
		return console.log('there was a problem connecting to the database sir!' + err);
	}
	console.log('connected to the database sir!');
	removeTeams();
	removeEmployees();
	insertTeams(function (error, pd, devops, acct) {
		if (error) {
			return console.log(error);
		}
		insertEmployees(pd, devops, acct, function (err, result){
				console.info("results after insert employees");
				console.info(result);
			retrieveEmployee(result, function(err, result) {

				retrieveEmployees(result, function(err, result) {
					//console.log(result);
					updateEmployee('Andrew', 'Jackson', result, function(err, result) {
						if (err) {
						console.error(err);
					} else {
						console.info("database activity complete sir!");
					}

					db.close();
					process.exit();
					});
				});
			});
		});
	});
});
