const jwt = require('jwt-simple');
const config = require('../config');

/**
 * Create JWT
 * @param user.email
 */
const createToken = (user) => {
	const time = new Date().getTime();
	const token = jwt.encode(
		{
			email: user.email,
			iat: time,
			exp: time + 60 * 60 * 1000, // minutes*seconds*milliseconds
		},
		config.TOKEN_SECRET,
	);

	return token;
};

const tokenPayload = (token) => {
	return jwt.decode(token, config.TOKEN_SECRET);
};

module.exports = {
	createToken,
	tokenPayload,
};
