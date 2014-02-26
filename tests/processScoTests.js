"use strict";
var _ = require('lodash');
var fs = require('fs');
var fstools = require('fs-tools');
var processSco = require('../lib/processSco.js');
var test = require('tap').test;
var pathToCopyFiles = 'testFiles/processScoTests/tmp';

test('Errors when you don\'t pass any parameters', function (t) {
	processSco(null, function (err, result) {
		t.ok(err, 'Should error');
		t.equal(err, 'Requires a path to the SCO manifest');
		t.end();
	});
});

test('Errors when you don\'t pass the path of the manifest', function (t) {
	processSco({}, function (err, result) {
		t.ok(err, 'Should error');
		t.equal(err, 'Requires a path to the SCO manifest');
		t.end();
	});
});

test('Does not error when referencing a SCO that doesn\'t have the Storyline mobile/player_compiled.js', function (t) {
	t.test('Should copy files for processing', _.curry(copyFilesToProcessingLocation)('testFiles/processScoTests/nonSpecificOutput'));

	t.test('Does not error when referencing a SCO that doesn\'t have the Storyline mobile/player_compiled.js', function (t) {
		processSco({pathOfManifest: pathToCopyFiles + '/imsmanifest.xml'}, function (err, result) {
			t.notOk(err, 'Should not error');
			t.end();
		});
	});

	t.test('Should remove temporary files copied for processing', removeTempProcessingLocation);
});

test('Successfully modifies a SCO that has the Storyline mobile/player_compiled.js', function (t) {
	t.test('Should copy files for processing', _.curry(copyFilesToProcessingLocation)('testFiles/processScoTests/storylineHtml5Output'));

	t.test('Should have code that\'s prior to processing', function (t) {
		var playerCompiledJsString = fs.readFileSync(pathToCopyFiles + '/mobile/player_compiled.js', {encoding: 'utf8'});
		t.ok(playerCompiledJsString.indexOf('var k=j-window.innerHeight') >= 0, 'Should still have this code');
		t.ok(playerCompiledJsString.indexOf('if(self!=top)a=a.replace("framewrap","portrait .framewrap").replace("interstitial","portrait .interstitial"),player.rotatePortraitFramedStyleSheet=document.createElement("style"),player.rotatePortraitFramedStyleSheet.innerHTML=a,document.body.appendChild(player.rotatePortraitFramedStyleSheet)') >= 0, 'Should still have this code');
		t.end();
	});

	t.test('Should find modfied text in the Storyline mobile/player_compiled.js', function (t) {
		processSco({pathOfManifest: pathToCopyFiles + '/imsmanifest.xml'}, function (err, result) {
			t.notOk(err, 'Should not error');
			var playerCompiledJsString = fs.readFileSync(pathToCopyFiles + '/mobile/player_compiled.js', {encoding: 'utf8'});
			t.equal(playerCompiledJsString.indexOf('var selfTop=self;'), 0, 'Should find JS added at beginning of the file');
			t.ok(playerCompiledJsString.indexOf('selfTop.', 20) > 0, 'Should find other instances of selfTop from the replacement later in the file');
			t.ok(playerCompiledJsString.indexOf('var k=j-window.innerHeight') == -1, 'Should have removed this code');
			t.ok(playerCompiledJsString.indexOf('var k=0') >= 0, 'The code above should have been replaced with this code.');
			t.ok(playerCompiledJsString.indexOf('if(self!=top)a=a.replace("framewrap","portrait .framewrap").replace("interstitial","portrait .interstitial"),player.rotatePortraitFramedStyleSheet=document.createElement("style"),player.rotatePortraitFramedStyleSheet.innerHTML=a,document.body.appendChild(player.rotatePortraitFramedStyleSheet)') == -1, 'Should have removed this code');
			t.end();
		});
	});

	t.test('Should remove temporary files copied for processing', removeTempProcessingLocation);
});

test('Does not error when referencing a SCO that doesn\'t have the Captivate SCORM_utilities.js', function (t) {
	t.test('Should copy files for processing', _.curry(copyFilesToProcessingLocation)('testFiles/processScoTests/nonSpecificOutput'));

	t.test('Does not error when referencing a SCO that doesn\'t have the Captivate SCORM_utilities.js', function (t) {
		processSco({pathOfManifest: pathToCopyFiles + '/imsmanifest.xml'}, function (err, result) {
			t.notOk(err, 'Should not error');
			t.end();
		});
	});

	t.test('Should remove temporary files copied for processing', removeTempProcessingLocation);
});

test('Successfully modifies a SCO that has the Captivate SCORM_utilities.js', function (t) {
	t.test('Should copy files for processing', _.curry(copyFilesToProcessingLocation)('testFiles/processScoTests/captivateOutput'));

	t.test('Should find modfied text in the Captivate SCORM_utilities.js', function (t) {
		processSco({pathOfManifest: pathToCopyFiles + '/imsmanifest.xml'}, function (err, result) {
			t.notOk(err, 'Should not error');
			var playerCompiledJsString = fs.readFileSync(pathToCopyFiles + '/SCORM_utilities.js', {encoding: 'utf8'});
			t.ok(playerCompiledJsString.indexOf('WMODE : "opaque"') >= 0, 'Should find wmode config now set to opaque');
			t.end();
		});
	});

	t.test('Should remove temporary files copied for processing', removeTempProcessingLocation);
});

test('Successfully modifies a SCO that has the Captivate htm/html file that contains the CaptivateContent ID on one of its elements', function (t) {
	t.test('Should copy files for processing', _.curry(copyFilesToProcessingLocation)('testFiles/processScoTests/captivateOutput'));

	t.test('Should find modfied text in the Captivate SCORM_utilities.js', function (t) {
		processSco({pathOfManifest: pathToCopyFiles + '/imsmanifest.xml'}, function (err, result) {
			t.notOk(err, 'Should not error');
			var modifiedHtml = fs.readFileSync(pathToCopyFiles + '/captivate_noquiz_SWFandHTML5output.htm', {encoding: 'utf8'});
			console.log(JSON.stringify(modifiedHtml));
			t.ok(modifiedHtml.match(/<head>\s*<style>\s*html\s*\{\s*height:\s*100%\s*\}\s*body\s*\{\s*height:\s*100%;\s*width:\s*100%;\s*display:\s*table;\s*margin:\s*0\s*\}\s*#CaptivateContent\s*\{\s*display:\s*table-cell\s*;\s*height:\s*100%\s*;\s*vertical-align:\s*middle\s*}\s*<\/style>/), 'Should find CSS added to the head');
			t.end();
		});
	});

	t.test('Should remove temporary files copied for processing', removeTempProcessingLocation);
});

test('Does not error when referencing a SCO that doesn\'t have the Storyline story.html', function (t) {
	t.test('Should copy files for processing', _.curry(copyFilesToProcessingLocation)('testFiles/processScoTests/nonSpecificOutput'));

	t.test('Does not error when referencing a SCO that doesn\'t have the Storyline story.html', function (t) {
		processSco({pathOfManifest: pathToCopyFiles + '/imsmanifest.xml'}, function (err, result) {
			t.notOk(err, 'Should not error');
			t.end();
		});
	});

	t.test('Should remove temporary files copied for processing', removeTempProcessingLocation);
});

test('Successfully modifies a SCO that has the Storyline story.html', function (t) {
	t.test('Should copy files for processing', _.curry(copyFilesToProcessingLocation)('testFiles/processScoTests/storylineHtml5Output'));

	t.test('Should find modfied text in the Storyline story.html', function (t) {
		processSco({pathOfManifest: pathToCopyFiles + '/imsmanifest.xml'}, function (err, result) {
			t.notOk(err, 'Should not error');
			var playerCompiledJsString = fs.readFileSync(pathToCopyFiles + '/story.html', {encoding: 'utf8'});
			t.ok(playerCompiledJsString.indexOf('g_strWMode = "opaque"') >= 0, 'Should find g_strWMode config now set to opaque');
			t.end();
		});
	});

	t.test('Should remove temporary files copied for processing', removeTempProcessingLocation);
});

function copyFilesToProcessingLocation(pathOfTestFiles ,t) {
	fstools.copy(pathOfTestFiles, pathToCopyFiles, function (err) {
		if (err) t.fail('Failed to copy files to process');
		t.end();
	});
}

function removeTempProcessingLocation(t) {
	fstools.remove(pathToCopyFiles, function (err) {
		if (err) t.fail('Failed to remove copied files for processing');
		t.end();
	});
}