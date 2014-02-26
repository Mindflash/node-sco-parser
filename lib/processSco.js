"use strict";
var _ = require('lodash');
var async = require('async');
var fs = require('fs');
var fstools = require('fs-tools');
var path = require('path');

module.exports = function(params, cb) {
	params = params || {};
	if (!params.pathOfManifest) return cb('Requires a path to the SCO manifest');

	async.parallel([
		fixStorylineMobileJs,
		fixStorylineWindowMode,
		fixCaptivateFlashPlayerScaling,
		fixCaptivateWindowMode
	], cb);

	function fixStorylineMobileJs(cb) {
		var playerCompiledJsPath = path.join(path.dirname(params.pathOfManifest), 'mobile', 'player_compiled.js');
		if (!fs.existsSync(playerCompiledJsPath)) return cb();

		try {
			var playerCompiledJsString = fs.readFileSync(playerCompiledJsPath, {encoding: 'utf8'});

			// Storyline is referencing parent frame which causes cross-frame issues on iOS.
			// Hacking the mobile player JS to have it reference itself instead and thus fix it.
			playerCompiledJsString = 'var scoParserTop=self;' + playerCompiledJsString;
			playerCompiledJsString = playerCompiledJsString.replace(/top\./g, 'scoParserTop.');

			// This fixes landscape mode on iPad in Storyline.
			playerCompiledJsString = 'window.scoParserOrientation=90;' + playerCompiledJsString;
			playerCompiledJsString = playerCompiledJsString.replace(/window\.orientation/g, 'window.scoParserOrientation');

			fs.writeFileSync(playerCompiledJsPath, playerCompiledJsString, {encoding: 'utf8'});
			cb();
		} catch (err) {
			return cb(err);
		}
	}

	// Storyline sets SWFs' wmode to 'window'. Fix this to be 'opaque' so it works well within a webapp.
	function fixStorylineWindowMode(cb) {
		var storyHtmlPath = path.join(path.dirname(params.pathOfManifest), 'story.html');
		if (!fs.existsSync(storyHtmlPath)) return cb();

		try {
			var storyHtmlString = fs.readFileSync(storyHtmlPath, {encoding: 'utf8'});
			storyHtmlString = storyHtmlString.replace(/g_strWMode\s*=\s*"window"/g, 'g_strWMode = "opaque"');
			fs.writeFileSync(storyHtmlPath, storyHtmlString, {encoding: 'utf8'});
			cb();
		} catch (err) {
			return cb(err);
		}
	}

	// Help captivate scale better when playing SWF.
	function fixCaptivateFlashPlayerScaling(cb) {
		try {
			fstools.walkSync(path.dirname(params.pathOfManifest), '\.html|\.htm$', function (path, stats) {
				var fileHtmlString = fs.readFileSync(path, {encoding: 'utf8'});

				// If we see an element with an ID of CaptivateContent then add our CSS hack.
				if(fileHtmlString.match(/id\s*=\s*"CaptivateContent"/)) {
					var headTag = '<head>';
					var afterOpenHeadTagIndex = fileHtmlString.indexOf(headTag) + headTag.length;
					fileHtmlString = fileHtmlString.substr(0, afterOpenHeadTagIndex) +
						'<style> \
							html {height:100%} \
							body {height:100%; width:100%; display:table; margin:0} \
   							#CaptivateContent {display:table-cell; height:100%; vertical-align:middle} \
						</style>' +
						fileHtmlString.substr(afterOpenHeadTagIndex);
					fs.writeFileSync(path, fileHtmlString, {encoding: 'utf8'});
				}
			});
			cb();
		} catch (err) {
			console.log(JSON.stringify(err));
			return cb(err);
		}
	}

	// Captivate sets SWFs' wmode to 'window'. Fix this to be 'opaque' so it works well within a webapp.
	function fixCaptivateWindowMode(cb) {
		var scormUtilitiesJsPath = path.join(path.dirname(params.pathOfManifest), 'SCORM_utilities.js');
		if (!fs.existsSync(scormUtilitiesJsPath)) return cb();

		try {
			var scormUtilitiesJsString = fs.readFileSync(scormUtilitiesJsPath, {encoding: 'utf8'});
			scormUtilitiesJsString = scormUtilitiesJsString.replace(/WMODE\s*:\s*"window"/g,'WMODE : "opaque"');
			fs.writeFileSync(scormUtilitiesJsPath, scormUtilitiesJsString, {encoding: 'utf8'});
			cb();
		} catch (err) {
			return cb(err);
		}
	}
};