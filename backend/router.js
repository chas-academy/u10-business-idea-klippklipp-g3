/**
 * API router
 *
 * v.0.0.1 July 2018
 */
const passport = require('passport');
const Auth = require('./auth/auth');
const Public = require('./public/public');

// create authenticate middleware,
// using passport jwt strategy,
// no session support (cookies session use by passport)
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

// other middlewares
// const checkAuthenticated = (req, res, next) => {
// 	// User is authenticated and logged in
// 	if (req.isAuthenticated()) {
// 		return next();
// 	}
// 	// User should login
// 	res.redirect('http://localhost/login');
// };
// // Middleware for logged in users
// const checkNotAuthenticated = (req, res, next) => {
// 	// User is authenticated and logged in
// 	if (req.isAuthenticated()) {
// 		return res.redirect('http://localhost');
// 	}

// 	next();
// };

module.exports = (api) => {
	// api.get('/', checkAuthenticated, (req, res) => {
	// 	res.send('I am OK');
	// });

	api.get('/', (req, res) => {
		res.send('I am OK');
	});

	api.post('/signup', Public.signup);

	api.post('/signin', requireSignin, Public.signin);

	// Users endpoint
	api.get('/users', requireAuth, Auth.users);

	api.patch('/users/:id', requireAuth, Auth.updateUser);

	api.get('/users/:id', requireAuth, Auth.userById);

	api.get('/users/:id/ratings', requireAuth, Auth.ratingsByUserId);

	// Hairdressers endpoint
	api.get('/hairdressers', Public.hairdressers);

	api.get('/hairdressers/:id', Public.hairdresserById);

	api.patch('/hairdressers/:id', requireAuth, Auth.updateHairdresser);

	api.get('/hairdressers/:id/ratings', Public.ratingsByHairdresserId);

	api.put(
		'/hairdressers/:id/ratings',
		requireAuth,
		Auth.updateOrCreateRating,
	);
};
