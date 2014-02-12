"use strict";
var fs = require('fs');
var test = require('tap').test;
var scoParserIndex = require('../index.js');

var params = {
	pathToScoZip: 'testFiles/unpackScoZipTests/articulate_sco_with_quiz.zip',
	pathToExtractZip: 'testFiles/unpackScoZipTests/extractFolder'
};

test('Successfully unpacks SCO zip file, validates imsmanifest.xml, and parses it for information', function (t) {
	var scoParser = scoParserIndex(params);
	t.test('Should extract SCO zip file and validate imsmanifest.xml', function (t) {
		scoParser.validate(function (err, result) {
			t.notOk(err, 'Should not error');
			t.ok(fs.existsSync(params.pathToExtractZip), 'Should have created path in which to extract zip');
			t.ok(result, 'Should receive XML JSONified');
			t.end();
		});
	});

	t.test('Should parse imsmanifest.xml to find base html file', function (t) {
		scoParser.parse(function (err, result) {
			t.notOk(err, 'Should not error');
			t.ok(result, 'Should receive information parsed from the manifest XML');
			t.equal(result.scoHtmlHref, 'index_lms.html', 'Should receive the SCO\'s start-up HTML file from the manifest');
			t.equal(result.quizCount, 1, 'Finds a quiz in the sco');
			t.end();
		})
	});

	t.test('Deletes folder in which to unzip the files', function (t) {
		scoParser.destroy(function (err, result) {
			t.notOk(err, "failed to remove directory where files were unzipped to");
			t.end();
		});
	});
});