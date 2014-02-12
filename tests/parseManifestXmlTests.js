var test = require('tap').test;
var parseManifestXml = require('../parseManifestXml.js');

test('Finds SCO HTML file href in Articulate SCO', function(t) {
	t.test('Finds quiz in SCO', function (t) {
		var params = {pathToExtractZip: 'testFiles/parseManifestXmlTests/articulate/scoWithQuiz'};
		parseManifestXml(params, function (err, result) {
			t.notOk(err, 'Should not error');
			t.ok(result, 'Should receive information parsed from the manifest XML');
			t.equal(result.scoHtmlHref, 'index_lms.html', 'got a starting point');
			t.equal(result.quizCount, 1, 'Recognize that a quiz exists in the sco');
			t.end();
		});
	});

	t.test('Finds no quiz in SCO', function (t) {
		var params = {pathToExtractZip: 'testFiles/parseManifestXmlTests/captivate/scoWithNoQuizAndSwfAndHtml5Outputs'};
		parseManifestXml(params, function (err, result) {
			t.notOk(err, 'Should not error');
			t.ok(result, 'Should receive information parsed from the manifest XML');
			t.equal(result.scoHtmlHref, 'multiscreen.html', 'got a starting point');
			t.equal(result.quizCount, 0, 'Finds no quizzes in the sco');
			t.end();
		});
	});

	t.end();
});