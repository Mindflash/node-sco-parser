"use strict";
var async = require('async');
var fn = require('./helpers/functionHelper.js');
var readSco = require('./readSco.js');
var validateSco = require('./validateSco.js');
var parseSco = require('./parseSco.js');

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

	function parse(cb) {
		return parseSco(params, cb);
	}

	return {
		validate: validate,
		parse: parse
	}
}

module.exports = scoParser;
