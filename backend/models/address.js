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
 		type: String,
 		maxlength: 10,
 	},
 });

 // Export address schema
 module.exports = addressSchema;