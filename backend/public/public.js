const User = require('../models/user');
const Rating = require('../models/rating');
const jwt = require('../auth/jwt');

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
exports.signin = (req, res) =>
	res.status(200).json({
		status: 200,
		token: jwt.createToken(req.body),
		id: req.user._id,
	});

// Return average rating for hairdresser
function average(ratings) {
	const averageRating =
		ratings.reduce((a, b) => a + b.value, 0) / ratings.length;
	return Math.round(averageRating * 10) / 10;
}

/**
 * Return all hairdressers
 */
exports.hairdressers = async (req, res, next) => {
	await User.find({ role: 'SUPPLIER' })
		.exec()
		.then((hairdressers) =>
			res.status(200).json({
				status: 200,
				payload: {
					hairdressers,
				},
			}),
		)
		.catch(next);
};

/**
 * Return a hairdresser by id
 */
exports.hairdresserById = async (req, res, next) => {
	const { id } = req.params;

	await User.findOne({ _id: id, role: 'SUPPLIER' })
		.exec()
		.then((hairdresser) => {
			if (hairdresser) {
				return res.status(200).json({
					status: 200,
					payload: {
						hairdresser,
					},
				});
			}

			return res.status(404).json({
				status: 404,
				message: 'Hairdresser not found',
			});
		})
		.catch(next);
};

/**
 * Return all ratings the hairdresser have
 */
exports.ratingsByHairdresserId = async (req, res, next) => {
	const { id } = req.params;

	await Rating.find({ refersTo: id })
		.populate('madeBy')
		.exec()
		.then((ratings) =>
			res.status(200).json({
				status: 200,
				payload: {
					ratings,
					average: average(ratings),
				},
			}),
		)
		.catch(next);
};
