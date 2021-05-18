const User = require('../models/user');

exports.hairdressers = async (req, res, next) => {
	await User.find({ role: 'SUPPLIER' }, (err, result) => {
		return res.status(200).send(result);
	});
};
