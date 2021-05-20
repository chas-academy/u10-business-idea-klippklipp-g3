const User = require('../models/user');
const Rating = require('../models/rating');

exports.hairdressers = async (req, res, next) => {
	const users = await User.find({ role: 'SUPPLIER' })
		.select('email role description address')
		.exec();

	res.status(200).json({
		status: 200,
		payload: {
			users: users,
		},
	});
};

exports.ratings = async (req, res, next) => {
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
