"use strict";
var xpath = require('xpath');
var dom = require('xmldom').DOMParser;
var fs = require('fs');
var _ = require('lodash');

module.exports = function (params, cb) {
	params = params || {};
	if (!params.pathToExtractZip) return cb('Requires a path in which to find the SCO manifest XML');
	var path = params.pathToExtractZip + '/imsmanifest.xml';

	fs.readFile(path, 'ascii', function (err, data) {
		if (err) return cb(err);
		var doc = new dom().parseFromString(data.substring(2, data.length));

		return cb(null, {
			scoHtmlHref: findIndexFile(doc),
			quizCount: findQuizCount(doc)
		});
	});

	function findIndexFile(doc) {
		var nodes = xpath.select("(//resource[@href])[1]", doc);
		var attr = nodes[0].attributes;
		var filename = attr[_.findKey(attr, { 'name': 'href' })].value;
		return filename;
	}

	function findQuizCount(doc) {
		var nodes = xpath.select("//*[name()='adlcp:masteryscore']", doc);
		return nodes.length;
	}
};
