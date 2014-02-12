"use strict";
var _ = require('lodash');
var async = require('async');
var rmrf = require('rimraf');
var unpackScoZip = require('./lib/unpackScoZip');
var readManifestXml = require('./lib/readManifestXml');
var parseManifestXml = require('./lib/parseManifestXml');

function scoParser(params) {
	params = params || {};

	function validate(cb) {
		async.series({
			unpackScoZip: _.curry(unpackScoZip)(params),
			manifest: _.curry(readManifestXml)(params)
		}, function (err, result) {
			if (err) cb(err);
			cb(null, result.manifest);
		});
	}

	function parse(cb) {
		parseManifestXml(params, cb);
	}

	function destroy(cb) {
		if (!params.pathToExtractZip) return cb();
		rmrf(params.pathToExtractZip, cb);
	}

	return {
		validate: validate,
		parse: parse,
		destroy: destroy
	}
}

module.exports = scoParser;
