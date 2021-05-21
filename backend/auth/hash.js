const bcrypt = require('bcryptjs');

/**
 * Encrypt password using bcrypt
 * it returns promise that resolves with hased password
 * @param password:string
 */
exports.hashPass = async (password) => {
	try {
		// generate salt
		const salt = await bcrypt.genSalt(10);
		// hash/encrypt password
		const hash = await bcrypt.hash(password, salt);

		return hash;
	} catch (err) {
		return err;
	}
};
