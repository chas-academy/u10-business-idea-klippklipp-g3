module.exports = {
	MONGO_URI: process.env.MONGO_URI || 'mongodb://db:27017/auth',
	TOKEN_SECRET:
		process.env.TOKEN_SECRET ||
		'kGsw0alejoGQ8SLiBo3vlr1Mm5ocr8Bs0N9TlIOKzXJrvm70ho8ijvYLAMpXUaP',
	LISTEN_PORT: process.env.LISTEN_PORT || 8080,
};
