"use strict";
/**
 * Import dependencies.
 */

var express = require('express');
var engine = require('ejs-locals');
var path = require('path');
var map = require('../../app').map;
var register = require('./routes/register').register; // For working with the register.ejs view.
var profile = require('./routes/profile'); // For working with the profile.ejs view.
var login = require('./routes/login'); // For working with the login.ejs view.
var resetPassword = require('./routes/resetPassword').resetPassword;

/**
 * Configure application.
 */

var app = module.exports = express();
app.configure(function() {
	app.engine('ejs', engine);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use('/assets', express.static(path.join(__dirname, 'assets')));
});
app.configure('development', function() {
	app.use(express.errorHandler());
});
/**
 * Route requests.
 */

app.map = map;
app.map(app, {
	'/seller': {
		'/add': {
			get: profile.showRegistrationForm,
			post: profile.add
		},
		'/edit': {
			get: profile.showRegistrationForm,
			post: profile.edit,
			'/verify-email': {
				get: profile.verifyEmail
			}
		},
		'/view': {
			get: profile.show
		},
		'/remove': {
			get: profile.remove
		},
		'/login': {
			get: login.showLoginForm,
			post: login.startLoginSession,
			'/password': {
				'/forgot': {
					get: resetPassword.showForgot,
					post: resetPassword.sendEmail
				},
				'/reset': {
					get: resetPassword.showReset,
					post: resetPassword.reset
				}
			}
		}
	}
});
