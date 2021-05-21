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
	await User.findOne({ email })
		.exec()
		// email exists
		.then((result) => {
			if (result) {
				res.status(422).json({
					status: 422,
					message: `${email} already registered`,
				});
			}
		})
		// return error to next function
		.catch(next);

	// user does not exist
	// create new user
	const user = new User({
		email,
		password,
		role,
	});
	// save new record to db
	user.save()
		.then((result) =>
			// save completed
			// return json
			res.status(200).json({
				status: 200,
				token: jwt.createToken(user),
			}),
		)
		.catch(next);
};

/**
 * Signin route
 */
exports.signin = (req, res) => {
	res.status(200).json({
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
		await User.find()
			.then((users) =>
				res.status(200).json({
					status: 200,
					payload: { users },
				}),
			)
			.catch(next);
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
		const { id } = req.params;

		await User.findById(id)
			.exec()
			.then((user) => {
				if (user) {
					res.status(200).json({
						status: 200,
						payload: {
							user,
						},
					});
				} else {
					res.status(404).json({
						status: 404,
						message: 'User not found',
					});
				}
			})
			.catch(next);
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
			value,
			date: new Date(),
		});
		// save new record to db
		rating
			.save()
			.then((result) => {
				res.status(200).json({
					status: 200,
					message: 'Rating saved',
					payload: {
						id: result._id,
					},
				});
			})
			.catch(next);
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
	const { role, _id: id } = req.user;

	if (time < payload.exp) {
		if (role === 'SUPPLIER') {
			await Rating.find({ refersto: id })
				.exec()
				.then((ratings) =>
					res.status(200).json({
						status: 200,
						payload: {
							ratings,
						},
					}),
				)
				.catch(next);
		} else if (role === 'CUSTOMER') {
			await Rating.find({ madeBy: id })
				.exec()
				.then((ratings) =>
					res.status(200).json({
						status: 200,
						payload: { ratings },
					}),
				)
				.catch(next);
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
