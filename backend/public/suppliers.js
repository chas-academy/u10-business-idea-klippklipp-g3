const User = require('../models/user');
const Rating = require('../models/rating');

// Return average rating for hairdresser
function average(ratings) {
	const averageRating =
		ratings.reduce((a, b) => a + b.value, 0) / ratings.length;
	return Math.round(averageRating * 10) / 10;
}

exports.hairdressers = async (req, res, next) => {
	await User.find({ role: 'SUPPLIER' })
		.exec()
		.then((users) =>
			res.status(200).json({
				status: 200,
				payload: {
					users,
				},
			}),
		)
		.catch(next);
};

exports.ratings = async (req, res, next) => {
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
