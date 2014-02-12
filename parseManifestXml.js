"use strict";

var xpath = require('xpath');
var dom = require('xmldom').DOMParser;
var fs = require('fs');
var _ = require('lodash');

module.exports = function(params, cb) {
	var params = params || {};
	if (!params.pathToExtractZip) return cb('Requires a path in which to find the SCO manifest XML');

	fs.readFile(params.pathToExtractZip + '/imsmanifest.xml', 'ascii', function(err, data) {
		if (err) return cb(err);

		var doc = new dom().parseFromString(data.substring(2, data.length));

		function findIndexFile() {
			var nodes = xpath.select("(//resource[@href])[1]", doc);
			var attr = nodes[0].attributes;
			var filename = attr[_.findKey(attr, { 'name': 'href' })].value;
			return filename;
		}

		function findQuizCount() {
			var nodes = xpath.select("//*[name()='adlcp:masteryscore']", doc);
			return nodes.length;
		}

		return cb(null, {
			scoHtmlHref: findIndexFile(),
			quizCount: findQuizCount()
		});
	});
};