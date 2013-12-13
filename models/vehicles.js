/*jshint node: true*/

'use strict';

/**
 * @file models/vehicles.js
 * Component: vehicles
 * Purpose: Defines Mongoose model for vehicle objects.
 */

/* Import external modules. */
var mongoose = require('mongoose');

/* Model */
var vehicleSchema = mongoose.Schema({
	market: { // new or used
		type: String,
		required: true
	},
	type: {
		make: {
			type: String,
			required: true
		},
		model: {
			type: String,
			required: true
		},
		year: { // A four-digit year.
			type: Number,
			required: true,
			min: 1886, // First car was manufactured in 1886.
			validate: function (value) {
				var currentYear = new Date(Date.now()).getFullYear();
				return value <= currentYear ? true : false;
			}
		}
	},
	description: {
		mileage: { // In kilometres.
			type: Number,
			required: true,
			min: 0
		},
		color: {
			type: String,
			required: true
		},
		fullServiceHistory: {
			type: Boolean,
			default: false
		}
	},
	mechanics: {
		engineCapacity: { // In litres.
			type: Number,
			required: true,
			min: 0
		},
		fuel: {
			type: String,
			required: true
		},
		transmission: {
			type: String,
			required: true
		},
		absBrakes: {
			type: Boolean,
			default: false
		},
		powerSteering: {
			type: Boolean,
			default: false
		}
	},
	luxuries: {
		electricWindows: {
			type: String,
			default: 'None'
		},
		airConditioning: {
			type: Boolean,
			default: false
		},
		cdPlayer: {
			type: Boolean,
			default: false
		},
		radio: {
			type: Boolean,
			default: false
		}
	},
	security: {
		alarm: {
			type: Boolean,
			default: false
		},
		centralLocking: {
			type: Boolean,
			default: false
		},
		immobilizer: {
			type: Boolean,
			default: false
		},
		gearLock: {
			type: Boolean,
			default: false
		}
	},
	safety: {
		airBags: {
			type: Number,
			default: 0,
			min: 0
		}
	},
	photos: { // File paths to the photos.
		type: [String],
		default: []
	},
	price: {
		value: {
			type: Number,
			required: true,
			min: 0
		},
		negotiable: {
			type: Boolean,
			default: false
		}
	},
	comments: {
		type: String,
		default: ''
	},
	expiryDate: { // Date on which advertisement of this vehicle expires.
		type: Date,
		default: Date.now
	},
	seller: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Seller'
	}
});

module.exports = mongoose.model('Vehicle', vehicleSchema);