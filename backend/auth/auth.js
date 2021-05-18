/*
 * Authentication API using mongodb
 */

const User = require('../models/user');
const Rating = require('../models/rating');
const jwt = require('./jwt');
/**
 * Signup - create new user
 * POST request
 * JSON object with props:
 * @param email: string,
 * @param password: string
 * @param role: string
 */
exports.signup = async (req, res, next) => {
	const { email, password, role } = req.body;
	// check parameters
	if (!email || !password || !role) {
		return res.status(422).send({
			status: 422,
			msg: 'Missing email or password',
		});
	}

	// check if user exist
	await User.findOne({ email }, (err, result) => {
		//return error to next function
		if (err) {
			return next(err);
		}
		// email exists
		if (result) {
			return res.status(422).send({
				status: 422,
				msg: `${email} already registered`,
			});
		}
	});

	// user does not exist
	// create new user
	const user = new User({
		email,
		password,
		role,
	});
	// save new record to db
	user.save((err) => {
		if (err) {
			return next(err);
		}
		// save completed
		// return json
		return res.json({
			status: 200,
			token: jwt.createToken(user),
		});
	});
};

/**
 * Signin route
 */
exports.signin = (req, res) => {
	res.json({
		status: 200,
		token: jwt.createToken(req.body),
	});
};

/**
 * User route
 */
exports.user = (req, res, next) => {
	const token = req.headers.authorization.split(' ')[1];
	const payload = jwt.tokenPayload(token);
	const time = new Date().getTime();

	if (time < payload.exp) {
		res.json({
			status: 200,
			payload,
		});
	} else {
		// res.redirect('/signin');
		res.json({
			status: 401,
			message: 'Session expired',
		});
	}
};

/**
 * User id route
 */
exports.userId = async (req, res, next) => {
	const email = req.params.id;
	const token = req.headers.authorization.split(' ')[1];
	const payload = jwt.tokenPayload(token);
	const time = new Date().getTime();

	if (time < payload.exp) {
		await User.findOne({ email }, (err, result) => {
			return res.status(200).send({
				role: result.role,
				email: result.email,
			});
		});
	} else {
		res.json({
			status: 401,
			message: 'Session expired',
		});
	}
};

/**
 * Hairdresser id rating route
 */
exports.rating = async (req, res, next) => {
	const hairdresserId = req.params.id;
	const { value } = req.body;
	const token = req.headers.authorization.split(' ')[1];
	const payload = jwt.tokenPayload(token);
	const time = new Date().getTime();
	const email = payload.email;

	if (time < payload.exp) {
		const user = (await User.findOne({ email }))._id;
		const hairdresser = (await User.findOne({ email: hairdresserId }))._id;

		// create new rating
		const rating = new Rating({
			madeBy: user,
			refersTo: hairdresser,
			value: value,
			date: new Date(),
		});
		// save new record to db
		rating.save((err) => {
			if (err) {
				return next(err);
			}
			// save completed
			// return json
			return res.json({
				status: 200,
				message: 'Rating saved',
			});
		});
	}
};
