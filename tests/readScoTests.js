var test = require('tap').test;
var child = require('child_process');
var fs = require('fs');
var pathToExtractZip = 'testFiles/extractFolder';

test('SCORM module should export expected app interface', function(t) {
	var scoParser = require('../index.js')();
	t.ok(scoParser, "Obj is valid");
	t.end();
});

test('Validation will fail when not initialized without params', function(t) {
	var scoParser = require('../index.js')();
	scoParser.validate(function (err, result) {
		t.ok(err, 'Should error');
		t.equal(err, 'Requires a path to the SCO\'s zip file', 'Should give needs a SCO path message');
		t.end();
	});
});

test('Validation will fail when not initialized without a path to the SCO\'s zip file', function(t) {
	var params = {pathToExtractZip: pathToExtractZip};
	var scoParser = require('../index.js')(params);
	scoParser.validate(function (err, result) {
		t.ok(err, 'Should error');
		t.equal(err, 'Requires a path to the SCO\'s zip file', 'Should give needs a SCO path message');
		t.end();
	});
});

test('Validation will fail when path in which to extract the zip file does', function(t) {
	var params = {pathToScoZip: 'testFiles/articulate_sco_with_quiz.zip'};
	var scoParser = require('../index.js')(params);
	scoParser.validate(function (err, result) {
		t.ok(err, 'Should error');
		t.equal(err, 'Requires a path in which to extract the SCO zip file', 'Should give needs a path in which to unzip message');
		t.end();
	});
});

test('Validation will fail when path to SCO zip does not exist', function(t) {
	var params = {
		pathToScoZip: '/path/to/fakepath.zip',
		pathToExtractZip: pathToExtractZip
	};
	var scoParser = require('../index.js')(params);
	scoParser.validate(function (err, result) {
		t.ok(err, 'Should error');
		t.equal(err, 'Invalid filename', 'Should error due to path in which to extract that zip\'s non-existence');
		t.end();
	});
});

test('Should error due to file not being a zip file', function(t) {
	var params = {
		pathToScoZip: 'testFiles/TheDude.jpg',
		pathToExtractZip: pathToExtractZip
	};
	var scoParser = require('../index.js')(params);
	scoParser.validate(function (err, result) {
		t.ok(err, 'Should error');
		t.equal(err, 'Invalid or unsupported zip format. No END header found', 'Should error due to file being a JPG.');
		t.end();
	});
});

test('Should not get error when file exists and is a zip file', function(t) {
	t.test('Should extract the zip', function (t) {
		var params = {
			pathToScoZip: 'testFiles/articulate_sco_with_quiz.zip',
			pathToExtractZip: pathToExtractZip
		};
		var scoParser = require('../index.js')(params);
		scoParser.validate(function (err, result) {
			t.notOk(err, 'Should not error');
			t.ok(fs.existsSync(pathToExtractZip), 'Should have created path in which to extract zip');
			t.end();
		});
	});

	t.test('Deletes folder in which to unzip the files', function (t) {
		child.execFile('rm', ['-rf', pathToExtractZip], {env: process.env}, function(err, stdout, stderr) {
			if (err) t.fail('Failed to remove directory files were unzipped into');
			t.end();
		});
	});
});