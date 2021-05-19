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
		return res.status(422).json({
			status: 422,
			message: 'Missing email, password or role',
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
			return res.status(422).json({
				status: 422,
				message: `${email} already registered`,
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
 * Users route
 */
exports.users = async (req, res, next) => {
	const token = req.headers.authorization.split(' ')[1];
	const payload = jwt.tokenPayload(token);
	const time = new Date().getTime();

	if (time < payload.exp) {
		const users = await User.find();

		res.status(200).json({
			status: 200,
			payload: {
				users: users,
			},
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
exports.userById = async (req, res, next) => {
	const token = req.headers.authorization.split(' ')[1];
	const payload = jwt.tokenPayload(token);
	const time = new Date().getTime();

	if (time < payload.exp) {
		const id = req.params.id;

		try {
			const user = await User.findOne({ _id: id });

			res.status(200).json({
				status: 200,
				payload: {
					user: user,
				},
			});
		} catch {
			res.status(404).json({
				status: 404,
				message: 'User not found',
			});
		}
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
exports.ratings = async (req, res, next) => {
	const token = req.headers.authorization.split(' ')[1];
	const payload = jwt.tokenPayload(token);
	const time = new Date().getTime();

	if (time < payload.exp) {
		const hairdresserId = req.params.id;
		const userId = req.user._id;
		const { value } = req.body;

		// create new rating
		const rating = new Rating({
			madeBy: userId,
			refersTo: hairdresserId,
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
			return res.status(200).json({
				status: 200,
				message: 'Rating saved',
			});
		});
	}
};
