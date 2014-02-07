"use strict";
var fs = require('fs');
var test = require('tap').test;
var scoParser = require('../index.js');
var testFolder = 'testFiles/unpackScoZipTests';
var pathToExtractZip = 'testFiles/unpackScoZipTests/extractFolder';
var rmrf = require('rimraf');

test('Successfully unpacks SCO zip file and validates imsmanifest.xml', function(t) {
	t.test('Should extract SCO zip file and validate imsmanifest.xml', function (t) {
		var params = {
			pathToScoZip: testFolder + '/articulate_sco_with_quiz.zip',
			pathToExtractZip: pathToExtractZip
		};
		scoParser(params).validate(function (err, result) {
			t.notOk(err, 'Should not error');
			t.ok(fs.existsSync(pathToExtractZip), 'Should have created path in which to extract zip');
			t.ok(result, 'Should receive XML JSONified');
			t.equal(result.manifest.resources[0].resource[0].$.href, 'index_lms.html', 'Should find the main html file');
			t.end();
		});
	});

	t.test('Deletes folder in which to unzip the files', function (t) {
		rmrf(pathToExtractZip, function(err, result) {
			t.notOk(err, "failed to remove directory where files were unzipped to");
			t.end();
		});
	});
});
