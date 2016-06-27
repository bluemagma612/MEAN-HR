var mongoose = require('mongoose');
var dbUrl = 'mongodb://localhost/humanResources';

mongoose.connect(dbUrl);

//Close the Mongoose connection on Control-c
process.on('SIGINT', function(){
	mongoose.connection.close(function () {
		console.log('Mongoose default connection disconnected sir!');
		process.exit(0);
	});
});

require('../models/employee');
require('../models/team');