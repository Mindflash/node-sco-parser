"use script";
var AdmZip = require('adm-zip');

module.exports = function (params, cb) {
	var params = params || {};
	if (!params.pathToScoZip) return cb('Requires a path to the SCO\'s zip file');
	if (!params.pathToExtractZip) return cb('Requires a path in which to extract the SCO zip file');
	console.log(JSON.stringify(params.pathToExtractZip));

	try {
		var zip = new AdmZip(params.pathToScoZip);
		zip.extractAllTo(params.pathToExtractZip, true);
	} catch (err) {
		console.log('err = ' + err);
		return cb(err);
	}
	cb();
};