/*
 * Authentication API using mongodb
 */

const User = require('../models/user');
const Rating = require('../models/rating');
const jwt = require('./jwt');

// Don't repeat same logic multiple times
const isValidToken = (payload) => {
	const { exp } = payload;
	const time = new Date().getTime();

	return time < exp;
};

const getToken = (req) => {
	const token = req.headers.authorization.split(' ')[1];
	return jwt.tokenPayload(token);
};

const notFound = (res) =>
	res.status(404).json({
		status: 404,
		message: 'User not found',
	});

/**
 * Users route
 */
const users = async (req, res, next) => {
	const payload = getToken(req);

	if (isValidToken(payload)) {
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
const userById = async (req, res, next) => {
	const payload = getToken(req);

	if (isValidToken(payload)) {
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

				return notFound(res);
			})
			.catch(() => notFound(res));
	} else {
		res.status(401).json({
			status: 401,
			message: 'Session expired',
		});
	}
};

/**
 * Update user
 */
const updateUser = async (req, res, next) => {
	const payload = getToken(req);

	if (isValidToken(payload)) {
		const updateUserId = req.params.id;
		const id = req.user._id.toString();
		const { name, address, description, email } = req.body;

		// User can only update its own profile
		if (id !== updateUserId) {
			return res.status(403).json({
				status: 403,
				message: 'Forbidden',
			});
		}

		await User.findByIdAndUpdate(
			updateUserId,
			{
				$set: { name, address, description, email },
			},
			{ new: true, omitUndefined: true },
		)
			.exec()
			.then((result) =>
				res.status(200).json({
					status: 200,
					user: result,
				}),
			)
			.catch(next);
	}
};

/**
 * Update hairdresser
 */
const updateHairdresser = async (req, res, next) => {
	const payload = getToken(req);

	if (isValidToken(payload)) {
		const updateUserId = req.params.id;
		const id = req.user._id.toString();
		const { name, address, description, email } = req.body;

		// User can only update its own profile
		if (id !== updateUserId) {
			return res.status(403).json({
				status: 403,
				message: 'Forbidden',
			});
		}

		await User.findByIdAndUpdate(
			updateUserId,
			{
				$set: { name, address, description, email },
			},
			{ new: true, omitUndefined: true },
		)
			.exec()
			.then((result) =>
				res.status(200).json({
					status: 200,
					user: result,
				}),
			)
			.catch(next);
	}
};

/**
 * Update or create new hairdresser rating
 */
const updateOrCreateRating = async (req, res, next) => {
	const payload = getToken(req);

	if (isValidToken(payload)) {
		const hairdresserId = req.params.id;
		const { _id: userId, role } = req.user;
		// const userId = req.user._id;
		const { ratingValue } = req.body;

		// Check if value is valid
		if (!ratingValue || ratingValue > 5 || ratingValue < 1) {
			return res.status(422).json({
				status: 422,
				message: 'Invalid value',
			});
		}

		// Only customers are able to rate hairdressers
		if (role !== 'CUSTOMER') {
			return res.status(403).json({
				status: 403,
				message: 'Forbidden',
			});
		}

		// create new rating
		const rating = {
			madeBy: userId,
			refersTo: hairdresserId,
			value: ratingValue,
			date: new Date().getTime(),
		};

		// Update or create new rating
		Rating.updateOne(
			{ madeBy: userId, refersTo: hairdresserId },
			{ $set: { value: rating.value, date: rating.date } },
			{ upsert: true },
		)
			.exec()
			.then(() =>
				res.status(200).json({
					status: 200,
					message: 'Rating saved',
				}),
			)
			.catch(() => notFound(res));
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
const ratingsByUserId = async (req, res, next) => {
	const payload = getToken(req);
	const { id } = req.params;

	if (isValidToken(payload)) {
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
			notFound(res);
		}
	} else {
		res.status(401).json({
			status: 401,
			message: 'Session expired',
		});
	}
};

module.exports = {
	users,
	userById,
	updateUser,
	updateHairdresser,
	updateOrCreateRating,
	ratingsByUserId,
};
