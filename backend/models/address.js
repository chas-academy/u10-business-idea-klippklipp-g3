const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define address model
const addressSchema = new Schema({
	street: {
		type: String,
		maxlength: 250,
	},
	city: {
		type: String,
		maxlength: 250,
	},
	zip: {
		type: Number,
		min: 0,
		max: 100000,
	},
});

// Export address schema
module.exports = addressSchema;
