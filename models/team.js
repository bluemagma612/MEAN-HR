var mongoose = require('mongoose');
var postFind = require('mongoose-post-find');
var async = require('async');
var Schema = mongoose.Schema;

var TeamSchema = new Schema ({
	name: {
		type: String,
		required: true
	},
	members: {
		type: [Schema.Types.Mixed]
	}
});

// this function looks for employee records that have the same team_id
// as the one found in the result object, which was populated by team 
// route get one function
function _attachMembers (Employee, result, callback) {
	//lookup employees that have the same team_id as the one
	//passed within the result object
	Employee.find({
		team_id: result._id
	}, function(error, employees) {
		if (error) {
			return callback(error);
		}
		result.members = employees;
		callback(null, result);
	});
}

//listen for find and findOne and run _attachMembers if heard, a function of Mongoose
TeamSchema.plugin(postFind, {
	find: function (result, callback) {
		var Employee = mongoose.model('Employee');

		async.each(result, function (item, callback) {
			_attachMembers(Employee, item, callback);
		}, function(error) {
			if (error) {
				return callback(error);
			}

			callback(null, result)
		});
	},
	findOne: function (result, callback) {
		//call _attachMembers passing the result of the team lookup as "result" param
		var Employee = mongoose.model('Employee');
		_attachMembers(Employee, result, callback);
	}
});
module.exports = mongoose.model('Team', TeamSchema);