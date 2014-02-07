var test = require('tap').test;
var parseManifestXml = require('../parseManifestXml.js');
var readManifestXml = require('../readManifestXml.js');

test('Finds SCO HTML file href in Articulate SCO', function(t) {
	var manifestJSON;

	t.test('Reads SCO XML file', function (t) {
		var params = {pathToExtractZip: 'testFiles/parseManifestXmlTests/articulate/scoWithQuiz'};
		readManifestXml(params, function (err, result) {
			t.notOk(err, 'Should not error');
			t.ok(result, 'Should receive XML JSONified');
			manifestJSON = result;
			t.end();
		});
	});

	t.test('Finds SCO HTML file href in read XML', function (t) {
		parseManifestXml(manifestJSON, function (err, result) {
			t.notOk(err, 'Should not error');
			t.ok(result, 'Should receive information parsed from the manifest XML');
			t.equal(result.scoHtmlHref, 'index_lms.html', 'Should receive the SCO\'s start-up HTML file from the manifest');
			t.end();
		});
	});
	t.end();
});

test('Finds SCO HTML file href in Captivate SCO', function(t) {
	var manifestJSON;

	t.test('Reads SCO XML file', function (t) {
		var params = {pathToExtractZip: 'testFiles/parseManifestXmlTests/captivate/scoWithNoQuizAndSwfAndHtml5Outputs'};
		readManifestXml(params, function (err, result) {
			t.notOk(err, 'Should not error');
			t.ok(result, 'Should receive XML JSONified');
			manifestJSON = result;
			t.end();
		});
	});

	t.test('Finds SCO HTML file href in read XML', function (t) {
		parseManifestXml(manifestJSON, function (err, result) {
			t.notOk(err, 'Should not error');
			t.ok(result, 'Should receive information parsed from the manifest XML');
			t.equal(result.scoHtmlHref, 'multiscreen.html', 'Should receive the SCO\'s start-up HTML file from the manifest');
			t.end();
		});
	});
	t.end();
});