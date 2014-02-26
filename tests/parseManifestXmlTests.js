var _ = require('lodash');
var parseManifestXml = require('../lib/parseManifestXml');
var test = require('tap').test;

test('Errors when you don\'t pass any parameters', function (t) {
	parseManifestXml(null, function (err, result) {
		t.ok(err, 'Should error');
		t.equal(err, 'Requires a path to the SCO manifest');
		t.end();
	});
});

test('Errors when you don\'t pass the path of the manifest', function (t) {
	parseManifestXml({}, function (err, result) {
		t.ok(err, 'Should error');
		t.equal(err, 'Requires a path to the SCO manifest');
		t.end();
	});
});

test('Errors when you pass a fake path to the manifest', function (t) {
	parseManifestXml({pathOfManifest: '/fake/path/to/imsmanifest.xml'}, function (err, result) {
		t.ok(err, 'Should error');
		t.equals(err.code, 'ENOENT', 'Should error about not being able to open the file');
		t.ok(_.contains(err.path, 'fake'), 'Should error about not being able to open the file');
		t.end();
	});
});

test('Parses expected information from Articulate SCO with quiz', function (t) {
	var params = {pathOfManifest: 'testFiles/parseManifestXmlTests/articulate/scoWithQuiz/imsmanifest.xml'};
	parseManifestXml(params, function (err, result) {
		t.notOk(err, 'Should not error');
		t.ok(result, 'Should receive information parsed from the manifest XML');
		t.equal(result.pathOfManifest, params.pathOfManifest, 'Should return the path of the manifest');
		t.equal(result.scoHtmlHref, 'index_lms.html', 'got a starting point');
		t.equal(result.quizCount, 1, 'Recognize that a quiz exists in the sco');
		t.equal(result.thumbnailHref, 'story_content/thumbnail.jpg', 'Should find thumbnail');
		t.ok(result.filePaths.indexOf('story_content/slides/61HGkVRQEMz.swf') >= 0, 'Should find file referenced in manifest');
		t.end();
	});
});

test('Parses expected information from Articulate SCO without quiz', function (t) {
	var params = {pathOfManifest: 'testFiles/parseManifestXmlTests/articulate/scoWithoutQuiz/imsmanifest.xml'};
	parseManifestXml(params, function (err, result) {
		t.notOk(err, 'Should not error');
		t.ok(result, 'Should receive information parsed from the manifest XML');
		t.equal(result.pathOfManifest, params.pathOfManifest, 'Should return the path of the manifest');
		t.equal(result.scoHtmlHref, 'index_lms.html', 'got a starting point');
		t.equal(result.quizCount, 0, 'Recognize that no quiz exists in the sco');
		t.equal(result.thumbnailHref, 'story_content/thumbnail.jpg', 'Should find thumbnail');
		t.ok(result.filePaths.indexOf('story_content/6hXDgtzkd44_X_80_DX278_DY278.swf') >= 0, 'Should find file referenced in manifest');
		t.end();
	});
});

test('Parses expected information from Captivate SCO with quiz', function (t) {
	var params = {pathOfManifest: 'testFiles/parseManifestXmlTests/captivate/scoWithQuiz/imsmanifest.xml'};
	parseManifestXml(params, function (err, result) {
		t.notOk(err, 'Should not error');
		t.ok(result, 'Should receive information parsed from the manifest XML');
		t.equal(result.pathOfManifest, params.pathOfManifest, 'Should return the path of the manifest');
		t.equal(result.scoHtmlHref, 'attempted_passedfailed_50per.htm', 'got a starting point');
		t.equal(result.quizCount, 0, 'Recognize that even though a quiz exists in the sco we can\'t determine this in Captivate');
		t.notOk(result.thumbnailHref, 'Should not find thumbnail');
		t.ok(result.filePaths.indexOf('attempted_passedfailed_50per.swf') >= 0, 'Should find file referenced in manifest');
		t.end();
	});
});

test('Parses expected information from Captivate SCO without quiz', function (t) {
	var params = {pathOfManifest: 'testFiles/parseManifestXmlTests/captivate/scoWithoutQuiz/imsmanifest.xml'};
	parseManifestXml(params, function (err, result) {
		t.notOk(err, 'Should not error');
		t.ok(result, 'Should receive information parsed from the manifest XML');
		t.equal(result.pathOfManifest, params.pathOfManifest, 'Should return the path of the manifest');
		t.equal(result.scoHtmlHref, 'multiscreen.html', 'got a starting point');
		t.equal(result.quizCount, 0, 'Recognize that no quiz exists in the sco');
		t.notOk(result.thumbnailHref, 'Should not find thumbnail');
		t.ok(result.filePaths.indexOf('captivate_noquiz_SWFandHTML5output.swf') >= 0, 'Should find file referenced in manifest');
		t.end();
	});
});