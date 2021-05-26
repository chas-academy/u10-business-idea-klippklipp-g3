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
	const validRoles = ['SUPPLIER', 'CUSTOMER'];
	const { email, password, role, description, address } = req.body;
	// check parameters
	if (!email || !password || !role) {
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
				email,
				password,
				role,
				description,
				address,
			});
			// save new record to db
			return user
				.save()
				.then(() =>
					// save completed
					// return json
					res.status(200).json({
						status: 200,
						token: jwt.createToken(user),
					}),
				)
				.catch(next);
		})
		// return error to next function
		.catch(next);
};

/**
 * Signin route
 */
exports.signin = (req, res) =>
	res.status(200).json({
		status: 200,
		token: jwt.createToken(req.body),
	});

/**
 * Users route
 */
exports.users = async (req, res, next) => {
	const token = req.headers.authorization.split(' ')[1];
	const payload = jwt.tokenPayload(token);
	const time = new Date().getTime();

	if (time < payload.exp) {
		await User.find()
			.exec()
			.then((users) =>
				res.status(200).json({
					status: 200,
					payload: { users },
				}),
			)
			.catch(next);
	} else {
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
					return res.status(200).json({
						status: 200,
						payload: {
							user,
						},
					});
				}

				return res.status(404).json({
					status: 404,
					message: 'User not found',
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

		// Check if value is valid
		if (value > 10 || value < 1) {
			return res.status(422).json({
				status: 422,
				message: 'Invalid value',
			});
		}

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
 * If requested user role is 'SUPPLIER', get all ratings for the hairdresser made by all customers.
 * If requested user role is 'CUSTOMER', get all ratings for the user made by the specified customer.
 */
exports.ratingsByUserId = async (req, res, next) => {
	const token = req.headers.authorization.split(' ')[1];
	const payload = jwt.tokenPayload(token);
	const time = new Date().getTime();
	const { id } = req.params;

	if (time < payload.exp) {
		// Check if user id exist
		const user = await User.findById(id).exec().catch(next);
		if (user) {
			const { role } = user;
			// Return all ratings by every customer have given to the supplier
			if (role === 'SUPPLIER') {
				await Rating.find({ refersTo: id })
					.populate('madeBy')
					.exec()
					.then((ratings) =>
						res.status(200).json({
							status: 200,
							payload: {
								user,
								ratings,
							},
						}),
					)
					.catch(next);
				// Return all ratings the customer have made
			} else if (role === 'CUSTOMER') {
				await Rating.find({ madeBy: id })
					.populate('refersTo')
					.exec()
					.then((ratings) =>
						res.status(200).json({
							status: 200,
							payload: {
								user,
								ratings,
							},
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
