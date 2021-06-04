const User = require('../models/user');
const Rating = require('../models/rating');
const jwt = require('../auth/jwt');

const notFound = (res) =>
	res.status(404).json({
		status: 404,
		message: 'User not found',
	});

/**
 * Signup - create new user
 * POST request
 * JSON object with props:
 * @param email: string,
 * @param password: string
 * @param role: string
 */
const signup = async (req, res, next) => {
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
const signin = async (req, res) => {
	const { email } = req.body;

	try {
		const user = await User.findOne({ email });
		res.status(200).json({
			status: 200,
			token: jwt.createToken(user),
		});
	} catch {
		notFound(res);
	}
};

// Return average rating for hairdresser
function average(ratings) {
	const averageRating =
		ratings.reduce((a, b) => a + b.value, 0) / ratings.length;
	return Math.round(averageRating * 10) / 10;
}

/**
 * Return all hairdressers
 */
const hairdressers = async (req, res, next) => {
	const { name, street, city, zip } = req.query;
	const queryObject = {};

	/**
	 * Build a simple naive query object to filter based on address fields, case insensitive.
	 * Address fields will only be used if it exists in the request queries.
	 */
	if (street && street.length > 0) {
		const regex = new RegExp(street, 'i');
		queryObject['address.street'] = regex;
	}

	if (city && city.length > 0) {
		const regex = new RegExp(city, 'i');
		queryObject['address.city'] = regex;
	}

	if (zip && zip.length > 0) {
		queryObject['address.zip'] = zip;
	}

	if (name && name.length > 0) {
		const regex = new RegExp(name, 'i');
		queryObject['name'] = regex;
	}

	await User.find({
		role: 'SUPPLIER',
		...queryObject,
	})
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
const hairdresserById = async (req, res, next) => {
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

			return notFound(res);
		})
		.catch(() => notFound(res));
};

/**
 * Return all ratings the hairdresser have
 */
const ratingsByHairdresserId = async (req, res, next) => {
	const { id } = req.params;

	try {
		const user = await User.findById(id);

		if (!user) {
			return notFound(res);
		}
	} catch {
		return notFound(res);
	}

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
		.catch(() => notFound(res));
};

module.exports = {
	signup,
	signin,
	hairdressers,
	hairdresserById,
	ratingsByHairdresserId,
};
