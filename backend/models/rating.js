const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const encrypt = require('../auth/hash');
const bcrypt = require('bcryptjs');

// Define rating model
const ratingSchema = new Schema({
	madeBy: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	refersTo: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	value: {
		type: Number,
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	__v: {
		type: Number,
		select: false,
	},
});

// Create model class
const ratingModel = mongoose.model('rating', ratingSchema);

module.exports = ratingModel;
