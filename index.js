"use strict";
var _ = require('lodash');
var async = require('async');
var unpackScoZip = require('./unpackScoZip.js');
var readManifestXml = require('./readManifestXml.js');
var parseManifestXml = require('./parseManifestXml.js');

function scoParser(params) {
	params = params || {};
	var imsManifestJSON;

	function validate(cb) {
		async.series({
			unpackScoZip: _.curry(unpackScoZip)(params),
			manifest: _.curry(readManifestXml)(params)
		}, function (err, result) {
			if(err) cb(err);
			imsManifestJSON = result.manifest;
			cb(null, imsManifestJSON);
		});
	}

	function parse(cb) {
		parseManifestXml(imsManifestJSON, cb);
	}

	return {
		validate: validate,
		parse: parse
	}
}

module.exports = scoParser;
