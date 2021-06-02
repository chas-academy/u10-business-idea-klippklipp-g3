/*
 * Authentication API using mongodb
 */

const User = require('../models/user');
const Rating = require('../models/rating');
const jwt = require('./jwt');
const addressSchema = require('../models/address');
/**
  * Signup - create new user
  * POST request
  * JSON object with props:
  * @param email: string,
  * @param password: string
  * @param role: string
  */
 exports.signup = async (req, res, next) => {
	const validRoles = ['SUPPLIER', 'CUSTOMER'];
	const { name, email, password, role, description, address } = req.body;

	// check parameters
	if (!name || !email || !password || !role) {
		return res.status(422).json({
			status: 422,
			message: 'Missing fields',
		});
	}

	// You can not assign ADMIN role during signup
	if (!validRoles.includes(role)) {
		return res.status(422).json({
			status: 422,
			message: 'Invalid role',
		});
	}

	// check if user exist
	await User.findOne({ email })
		.exec()
		.then((result) => {
			// email exists
			if (result) {
				return res.status(422).json({
					status: 422,
					message: `${email} already registered`,
				});
			}

			// user does not exist
			// create new user
			const user = new User({
				name,
				email,
				password,
				role,
				description,
				address,
			});
			// save new record to db
			return user
				.save()
				.then((result) => {
					// save completed
					// return json
					res.status(200).json({
						status: 200,
						token: jwt.createToken(user),
						id: result._id,
					});
				})
				.catch(next);
		})
		// return error to next function
		.catch(next);
};

/**
 * Signin route
 */
exports.signin = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });
		res.status(200).json({
			status: 200,
			token: jwt.createToken(user),
		});

	} catch {
		res.status(404).json({
			status: 404,
			message: 'User not found',
		});
	}
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
		res.status(401).json({
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
		res.status(401).json({
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
		rating.save((err, result) => {
			if (err) {
				return next(err);
			}
			// save completed
			// return json
			return res.status(200).json({
				status: 200,
				message: 'Rating saved',
				payload: {
					id: result._id,
				},
			});
		});
	} else {
		res.status(401).json({
			status: 401,
			message: 'Session expired',
		});
	}
};

/**
 * If role is 'SUPPLIER', get all ratings for the requested hairdresser.
 * If role is 'CUSTOMER', get all ratings for the requested user.
 */
exports.allRatings = async (req, res, next) => {
	const token = req.headers.authorization.split(' ')[1];
	const payload = jwt.tokenPayload(token);
	const time = new Date().getTime();
	const role = req.user.role;
	const id = req.user._id;

	if (time < payload.exp) {
		if (role === 'SUPPLIER') {
			const ratings = await Rating.find({ refersTo: id });
			res.status(200).json({
				status: 200,
				payload: {
					ratings: ratings,
				},
			});
		} else if (role === 'CUSTOMER') {
			const ratings = await Rating.find({ madeBy: id });
			res.status(200).json({
				status: 200,
				payload: {
					ratings: ratings,
				},
			});
		} else {
			res.status(403).json({
				status: 403,
				message: 'Forbidden',
			});
		}
	} else {
		res.status(401).json({
			status: 401,
			message: 'Session expired',
		});
	}
};
