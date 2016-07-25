var User = require('../models/user'),
	jwt = require('jsonwebtoken'),
	config = require('../../config');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express) {

	var usersRouter = express.Router();
	
	// on routes that end in /users
	// ----------------------------------------------------
	usersRouter.route('/users')

		// create a user (accessed at POST http://localhost:8080/api/users)
		.post(function(req,res) {
			// create an instance of the User model
			var user = new User();

			//set the users info (comes from the request)
			user.name = req.body.name;
			user.username = req.body.username;
			user.password = req.body.password;

			// save the user and check for errors
			user.save(function(err) {
				if (err) {
					//duplicate entry
					if (err.code == 11000)
						return res.json({ success: false, message: 'A user with that \
	username already exists. '});
					else
						return res.send(err);
				}
				
				res.json({ message: 'User created!'});
			});
		})

		// get all the users (accessed at http://localhost:8080/api/users)
		.get(function(req,res) {
			User.find(function(err, users) {
				if (err) res.send(err);

				//return the users
				res.json(users);
			});
		});



	// on routes that end in /users/:user_id
	// ----------------------------------------------------

	usersRouter.route('/users/:user_id')
		// get the user with that id
		// (accessed at GET http://localhost:8080/api/users/:user_id)
		.get(function(req,res) {
			User.findById(req.params.user_id, function(err, user) {
				if (err) res.send(err);

				// return that user
				res.json(user);
			});
		})

		// update the user with that id
		// (accessed at http://localhost:8080/api/users/:user_id)
		.put(function(req,res) {

			// use our model to find the user we want
			User.findById(req.params.user_id, function(err, user) {

				if (err) res.send(err);

				//update the users info only if its new
				if(req.body.name) user.name = req.body.name;
				if(req.body.username) user.username = req.body.username;
				if(req.body.password) user.password = req.body.password;

				// save the user
				user.save(function(err) {
					if (err) res.send(err);

					// return a message
					res.json({ message: 'User updated!'});
				});
			});
		})

	usersRouter.route('/users/:user_id')

		// delete the user with this id
		// (accessed at http://localhost:8080/api/users/:user_id)
		.delete(function(req,res) {
			User.remove({
				_id: req.params.user_id
			}, function(err, user) {
				if (err) return res.send(err);

				res.json({ message: 'Sucessfully deleted'});
		});
	});

	// api endpoint to get user information
	usersRouter.get('/me', function(req, res) {
		res.send(req.decoded);
	});

	return usersRouter;
}