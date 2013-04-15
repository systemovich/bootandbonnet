"use strict";
/**
 * Import dependencies.
 */

var express = require('express');
var engine = require('ejs-locals');
var path = require('path');
var map = require('../../app').map;
var register = require('./routes/register').register; // For working with the register.ejs view.

/**
 * Configure application.
 */

var app = module.exports = express();
app.configure(function() {
	app.engine('ejs', engine);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use('/components/vehicles/assets', express.static('components/vehicles/assets'));
});
app.configure('development', function() {
	app.use(express.errorHandler());
});
/**
 * Route requests.
 */

app.map = map;
app.map(app, {
	'/vehicle': {
		'/add': {
			get: register.add
		}
	}
});

