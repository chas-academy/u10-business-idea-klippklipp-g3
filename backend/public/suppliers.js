const User = require('../models/user');

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
