"use strict";
var AdmZip = require('adm-zip');
var async = require('async');

function scoParser(params) {
	params = params || {};

	function read(cb) {
		if (!params.pathToScoZip) cb('Requires a path to the SCO\'s zip file');
		if (!params.pathToExtractZip) cb('Requires a path in which to extract the SCO zip file');

		try {
			var zip = new AdmZip(params.pathToScoZip);
			zip.extractAllTo(params.pathToExtractZip, true);
			cb();
		} catch (err) {
			return cb(err, null);
		}
	}

	function validate(cb) {
		async.series([
			read,
			validateManifest
		], function (err, result) {
			cb(err, result);
		});
	}

	function validateManifest(cb) {
		cb();
	}

	function parse() {
		//
	}

	return {
		validate: validate
	}
}

module.exports = scoParser;
