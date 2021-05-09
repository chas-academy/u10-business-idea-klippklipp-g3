const express = require('express');
const flash = require('express-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const initPassport = require('./passport.config');
const router = require('./router');
const config = require('./config');

//initialize express server
const api = express();
api.use(flash());
api.use(
	session({
		secret: config.TOKEN_SECRET,
		resave: false,
		saveUninitialized: false,
	}),
);
api.use(passport.initialize());
api.use(passport.session());
//initialize passport
initPassport(passport);

//allow access from anywhere
api.use(cors());

//use json body parser
api.use(express.json());
api.use(express.urlencoded({ extended: false }));

//connect to auth database on localhost
mongoose
	.connect(config.MONGO_URI, {
		useCreateIndex: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then((_) => {
		console.log('MongoDB connected');
	});

//define routes
router(api);

//listen to a port
api.listen(config.LISTEN_PORT, () => {
	console.log('Server api on port:', config.LISTEN_PORT);
});
