const jwt = require('jwt-simple');
const config = require('../config');

/**
 * Create JWT
 * @param user
 */
const createToken = (user) => {
	const time = new Date().getTime();
	const token = jwt.encode(
		{
			id: user._id,
			name: user.name,
			email: user.email,
			description: user.description,
			address: user.address,
			role: user.role,
			iat: time,
			exp: time + 60 * 60 * 1000, // minutes*seconds*milliseconds, i.e. 1 hour
		},
		config.TOKEN_SECRET,
	);

	return token;
};

const tokenPayload = (token) => jwt.decode(token, config.TOKEN_SECRET);

module.exports = {
	createToken,
	tokenPayload,
};
