"use strict";

var mongoose = require('mongoose');
var mongodb = require('../../../database').mongoose;

var modelSchema = mongoose.Schema({
	name: String,
	shape: {type: String, default: 'general'},
	photo: {type: String, default: 'unknown' }, // File path to image.
	vehicles: [{type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle'}]
});

var makeSchema = mongoose.Schema({
	name: String,
	emblem: {type: String, default: 'unknown'}, // File path to image.
	models: [modelSchema]
});

var Make = mongoose.model('Make', makeSchema);

var async = require('async');
var db = require('../../../database').mysql;

var manufacturer = Object.defineProperties({}, {
	/* Data properties */
	id: {
		value: 0,
		writable: true,
		enumerable: true,
		configurable: false
	},
	name: {
		value: 0,
		writable: true,
		enumerable: true,
		configurable: false
	},
	emblem: {
		value: 0,
		writable: true,
		enumerable: true,
		configurable: false
	},
	models: {
		value: [],
		writable: true,
		enumerable: true,
		configurable: false
	},
	/* Methods */
	create: {
		value: function (callback) {
			var that = this;
			db.query("INSERT INTO manufacturers SET ?", {
				name: that.name,
				emblem: that.emblem
			}, function (err, result) {
				if (err) {
					return callback(err);
				}
				that.id = result.insertId;
				return callback(null, that);
			});
		},
		writable: false,
		enumerable: false,
		configurable: false
	},
	read: {
		value: function (callback) {
			var that = this;
			db.query("SELECT * FROM manufacturers WHERE id = ?", [
				that.id
			], function (err, rows, fields) {
				if (err) {
					return callback(err);
				}
				that.name = rows[0].name;
				that.emblem = rows[0].emblem;
				return callback(null, that);
			});
		},
		writable: false,
		enumerable: false,
		configurable: false
	},
	readModels: {
		value: function (callback) {
			var that = this;
			db.query("SELECT * FROM models WHERE manufacturerId = ?", [
				that.id
			], function (err, rows, fields) {
				if (err) {
					return callback(err);
				}
				async.forEach(rows, function(row, callback1) {
					that.models.push({
						id: row.id,
						name: row.name,
						picture: row.picture,
						shape: row.shape,
						manufacturerId: row.manufacturerId
					});
					callback1();
				}, function () {
					return callback(that);
				});
			});
		},
		writable: false,
		enumerable: false,
		configurable: false
	},
	update: {
		value: function (callback) {
			var that = this;
			db.query("UPDATE manufacturers SET ? WHERE id = ".concat(db.escape(that.id)), {
				name: that.name,
				emblem: that.emblem
			}, function (err, result) {
				if (err) {
					return callback(err);
				}
				return callback(null, that);
			});
		},
		writable: false,
		enumerable: false,
		configurable: false
	},
	del: {
		value: function (callback) {
			var that = this;
			db.query("DELETE FROM manufacturers WHERE id = ?", that.id, function (err, result) {
				if (err) {
					return callback(err);
				}
				return callback(null);
			});
		},
		writable: false,
		enumerable: false,
		configurable: false
	}
});

Object.preventExtensions(manufacturer);

var manufacturers = Object.defineProperties({}, {
	/* Date Properties */
	names: {
		value: [],
		writable: true,
		enumerable: true,
		configurable: false
	},
	objects: {
		value: [],
		writable: true,
		enumerable: true,
		configurable: false
	},
	/* Methods */
	readNames: {
		value: function (callback) {
			var that = this;
			db.query('SELECT name FROM manufacturers', function (err, rows, fields) {
				if (err) {
					return callback(err);
				}
				async.forEach(rows, function (row, callback1) {
					that.names.push(row.name);
					return callback1();
				}, function () {
					return callback(null, that);
				});
			});
		},
		writable: false,
		enumerable: false,
		configurable: false
	},
	readObjects: {
		value: function (callback) {
			var that = this;
			that.readNames(function (err, that) {
				if (err) {
					return callback(err);
				}
				async.forEach(that.names, function(manufacturerName, callback1) {
					that.objects.push({
						name: manufacturerName,
						models: []
					});
					return callback1();
				}, function() {
					async.forEach(that.objects, function (manufacturerObject, callback2) {
						db.query('SELECT models.name '
									.concat('FROM models ')
									.concat('INNER JOIN manufacturers ')
									.concat('WHERE manufacturers.name = ? ')
									.concat('AND manufacturers.id = models.manufacturer_id'), [
							manufacturerObject.name
						], function (err, rows, fields) {
								if (err) {
									return callback(err);
								}
								async.forEach(rows, function(row, callback3) {
									manufacturerObject.models.push({
										name: row.name
									});
									return callback3();
								}, function() {
									return callback2();
								});
						});
					}, function () {
						return callback(null, that);
					});
				});
			});
		},
		writable: false,
		enumerable: false,
		configurable: false
	}
});

Object.preventExtensions(manufacturers);

if (require.main === module) {
	manufacturers.readObjects(function(err, makes) {
		if (err) {
			throw err;
		} else {
			async.forEach(makes.objects, function (makeObject, callback) {
				var make = new Make({
					name: makeObject.name,
					models: makeObject.models
				});
				make.save(function (err, make) {
					if (err) {
						throw err;
					} else {
						console.log(make.name);
						callback();
					}
				});
			}, function () {
				console.log('Done!');
			});
		}
	});
}

module.exports = {
	manufacturer: manufacturer,
	manufacturers: manufacturers
};
