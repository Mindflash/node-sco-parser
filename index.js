"use strict";
var async = require('async');
var fn = require('./helpers/functionHelper.js');
var readSco = require('./readSco.js');
var validateSco = require('./validateSco.js');

function scoParser(params) {
	params = params || {};

	function validate(cb) {
		async.series([
			fn.wrapWithCb(readSco, params),
			fn.wrapWithCb(validateSco, params)
		], function (err, result) {
			cb(err, result);
		});
	}

	function parse() {
		//
	}

	return {
		validate: validate
	}
}

module.exports = scoParser;
