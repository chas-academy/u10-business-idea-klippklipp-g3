const { Strategy: LocalStrategy } = require('passport-local'),
	{ Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt'),
	bcrypt = require('bcryptjs'),
	User = require('./models/user'),
	config = require('./config');

const localStrategy = new LocalStrategy(
	{ usernameField: 'email' },
	async (email, password, done) => {
		try {
			const user = await User.findOne({ email }, (err, user) => {
				if (user) {
					return user;
				}

				console.log(err);
			});

			if (!user) {
				return done(null, false, {
					message: 'No user found',
				});
			}

			const isMatch = await bcrypt.compare(password, user.password);
			if (isMatch) {
				return done(null, user);
			} else {
				return done(null, false, {
					message: 'Incorrect password',
				});
			}
		} catch (err) {
			return done(err);
		}
	},
);

const jwtStrategy = new JwtStrategy(
	{
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		secretOrKey: config.TOKEN_SECRET,
	},
	async (payload, done) => {
		const user = await User.findOne(
			{ email: payload.email },
			(err, user) => {
				if (user) {
					return user;
				}

				throw err;
			},
		);
		if (user) {
			return done(null, user);
		}

		return done(null, false);
	},
);

module.exports = (passport) => {
	const getUserByEmail = async (email) => {
		await User.findOne({ email }, (err, user) => {
			if (user) {
				return user;
			}

			throw err;
		});
	};

	passport.use(localStrategy);
	passport.use(jwtStrategy);
	passport.serializeUser((user, done) => done(null, user));
	passport.deserializeUser((email, done) =>
		done(null, getUserByEmail(email)),
	);
};
