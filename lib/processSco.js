"use strict";
var fs = require('fs');
var path = require('path');

module.exports = function (params, cb) {
	params = params || {};
	if (!params.pathOfManifest) return cb('Requires a path to the SCO manifest');

	fixStorylineMobileJs();

	// Storyline is referencing parent frame which causes cross-frame issues on iOS.
	// Hacking the mobile player JS to have it reference itself instead and thus fix it.
	function fixStorylineMobileJs () {
		var playerCompiledJsPath = path.join(path.dirname(params.pathOfManifest), 'mobile', 'player_compiled.js');
		console.log(playerCompiledJsPath);
		if (!fs.existsSync(playerCompiledJsPath)) return cb();

		try {
			var playerCompiledJsString = fs.readFileSync(playerCompiledJsPath, {encoding: 'utf8'});
			playerCompiledJsString = 'var selfTop=self;' + playerCompiledJsString;
			playerCompiledJsString = playerCompiledJsString.replace(/top\./g, 'selfTop.');
			fs.writeFileSync(playerCompiledJsPath, playerCompiledJsString, {encoding: 'utf8'});
			cb();
		} catch (err) {
			return cb(err);
		}
	}
};