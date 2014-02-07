"use script";
var fs = require('fs');
var xml2js = require('xml2js');

module.exports = function (params, cb) {
	var params = params || {};
	if (!params.pathToExtractZip) return cb('Requires a path in which to find the SCO manifest XML');

	var parser = new xml2js.Parser();
	fs.readFile(params.pathToExtractZip + '/imsmanifest.xml', function(err, data) {
		if (err) return cb(err);
		try {
			parser.parseString(data, function (err, result) {
				if (err) return cb(err);
				cb(null, result);
			});
		} catch (err) {
			// Need to catch errors here. The parser appears to sometimes call the callback and then throw an error.
			// Catch the thrown error here since we've already called back with an error.
		}
	});
};