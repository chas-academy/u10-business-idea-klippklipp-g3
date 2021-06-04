const User = require('../models/user');
const Rating = require('../models/rating');

const hairdressers = async (req, res, next) => {
	try {
		const hairdressers = await User.find({
			role: 'SUPPLIER'
		});

		res.status(200).json({
			status: 200,
			payload: {
				hairdressers,
			},
		})
	} catch {
		res.status(404).json({
			status: 404,
			message: 'User not found',
		});
	}
};

const hairdresserById = async (req, res, next) => {
	const id = req.params.id;

	try {
		const user = await User.findOne({
			_id: id,
			role: 'SUPPLIER'
		});

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
};

const ratings = async (req, res, next) => {
	const id = req.params.id;
	const ratings = await Rating.find({ refersTo: id });

	// Return average rating for hairdresser
	function average(ratings) {
		const averageRating =
			ratings.reduce((a, b) => a + b.value, 0) / ratings.length;
		return Math.round(averageRating * 10) / 10;
	}

	res.status(200).json({
		status: 200,
		payload: {
			ratings: ratings,
			average: average(ratings),
		},
	});
};

module.exports = {
	hairdressers,
	hairdresserById,
	ratings
}