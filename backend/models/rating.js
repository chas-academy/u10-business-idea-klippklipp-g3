const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define rating model
const ratingSchema = new Schema({
	madeBy: {
		type: Schema.Types.ObjectId,
		ref: 'user',
		required: true,
	},
	refersTo: {
		type: Schema.Types.ObjectId,
		ref: 'user',
		required: true,
	},
	value: {
		type: Number,
		min: 1,
		max: 5,
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