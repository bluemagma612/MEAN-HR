var User = require('../models/user'),
	jwt = require('jsonwebtoken'),
	config = require('../../config');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express) {

	var apiRouter = express.Router();


	// route for authenticating users
	apiRouter.post('/authenticate', function(req, res) {

		// find the user
		// select the name username and password explicitly
		User.findOne({
			username: req.body.username
		}).select('name username password').exec(function(err, user) {

			if (err) throw err;

			// no user with that username was found
			if (!user) {
				res.json({
					success: false,
					message: 'Authentication failed. User not found'
				});
			} else if (user) {

				//check if password matches
				var validPassword = user.comparePassword(req.body.password);
				if (!validPassword) {
					res.json({
						success: false,
						message: 'Authentication failed. Wrong password'
					});
				} else {

					// if user is found and password is right
					// create a token
					var token = jwt.sign({
						name: user.name,
						username: user.username
					}, superSecret, {
						expiresIn: '24h' // expires in 24 hours
					});

					// return the information including token as JSON
					res.json({
						success: true,
						message: 'Enjoy your token',
						token: token
					});
				}
			}
		});
	});


	// middleware to use for all requests
	apiRouter.use(function(req,res,next){
		// do logging
		console.log('Somebody just came to our app');

		// check header or url parameters or post parameters for token
		var token = req.body.token || req.query.token || req.headers['x-access-token'];

		// decode token
		if (token) {

			// verfies secret and checks expiration
			jwt.verify(token, superSecret, function(err, decoded) {
				if (err) {
					return res.status(403).send({
						success: false,
						message: 'Failed to authenticate token'
					});
				} else {
					// if everythign is good, save the request for use in other routes
					req.decoded = decoded;

					next();
				}
	 		});
		} else {

			// if there is no token
			// return an http response of 403 and an error message
			return res.status(403).send({
				success: false,
				message: 'no token provided'
			});
		}
	});

	// test route to make sure everything is working
	// accessed at GET http://localhost:8080/api
	apiRouter.get('/', function(req,res) {
		res.json({message: 'welcome to the api'});
	});

	

	return apiRouter;
}