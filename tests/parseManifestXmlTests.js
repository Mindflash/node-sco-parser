/* eslint-disable prefer-destructuring */
const _ = require('lodash');
const parseManifestXml = require('../lib/parseManifestXml');
const test = require('tap').test;

test('Errors when you don\'t pass any parameters', (t) => {
  parseManifestXml(null, (err) => {
    t.ok(err, 'Should error');
    t.equal(err, 'Requires a path to the SCO manifest');
    t.end();
  });
});

test('Errors when you don\'t pass the path of the manifest', (t) => {
  parseManifestXml({}, (err) => {
    t.ok(err, 'Should error');
    t.equal(err, 'Requires a path to the SCO manifest');
    t.end();
  });
});

test('Errors when you pass a fake path to the manifest', (t) => {
  parseManifestXml({ pathOfManifest: '/fake/path/to/imsmanifest.xml' }, (err) => {
    t.ok(err, 'Should error');
    t.equals(err.code, 'ENOENT', 'Should error about not being able to open the file');
    t.ok(_.contains(err.path, 'fake'), 'Should error about not being able to open the file');
    t.end();
  });
});

test('Parses expected information from Articulate SCO with quiz', (t) => {
  const params = { pathOfManifest: 'tests/testFiles/parseManifestXmlTests/articulate/scoWithQuiz/imsmanifest.xml' };
  parseManifestXml(params, (err, result) => {
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

test('Parses expected information from Articulate SCO without quiz', (t) => {
  const params = { pathOfManifest: 'tests/testFiles/parseManifestXmlTests/articulate/scoWithoutQuiz/imsmanifest.xml' };
  parseManifestXml(params, (err, result) => {
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

test('Parses expected information from Articulate Rise SCO without quiz', (t) => {
  const params = { pathOfManifest: 'tests/testFiles/parseManifestXmlTests/articulate-rise/scoWithoutQuiz/imsmanifest.xml' };
  parseManifestXml(params, (err, result) => {
    t.notOk(err, 'Should not error');
    t.ok(result, 'Should receive information parsed from the manifest XML');
    t.equal(result.pathOfManifest, params.pathOfManifest, 'Should return the path of the manifest');
    t.equal(result.scoHtmlHref, 'scormdriver/indexAPI.html', 'got a starting point');
    t.equal(result.quizCount, 0, 'Recognize that no quiz exists in the sco');
    t.notOk(result.thumbnailHref, 'Should not find thumbnail');
    t.ok(result.filePaths.indexOf('scormcontent/assets/F7QWL2zlKMkxY1pb_2cxc4xpUr1zYWEf--iherb-logo.png') >= 0, 'Should find file referenced in manifest');
    t.end();
  });
});

test('Parses expected information from Articulate Rise SCO with quiz', (t) => {
  const params = { pathOfManifest: 'tests/testFiles/parseManifestXmlTests/articulate-rise/scoWithQuiz/imsmanifest.xml' };
  parseManifestXml(params, (err, result) => {
    t.notOk(err, 'Should not error');
    t.ok(result, 'Should receive information parsed from the manifest XML');
    t.equal(result.pathOfManifest, params.pathOfManifest, 'Should return the path of the manifest');
    t.equal(result.scoHtmlHref, 'scormdriver/indexAPI.html', 'got a starting point');
    t.equal(result.quizCount, 0, 'Recognize that even though a quiz exists in the sco we can\'t determine this in Articulate Rise');
    t.notOk(result.thumbnailHref, 'Should not find thumbnail');
    t.ok(result.filePaths.indexOf('scormcontent/assets/F7QWL2zlKMkxY1pb_2cxc4xpUr1zYWEf--iherb-logo.png') >= 0, 'Should find file referenced in manifest');
    t.end();
  });
});

test('Parses expected information from Captivate SCO with quiz', (t) => {
  const params = { pathOfManifest: 'tests/testFiles/parseManifestXmlTests/captivate/scoWithQuiz/imsmanifest.xml' };
  parseManifestXml(params, (err, result) => {
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

test('Parses expected information from Captivate SCO without quiz', (t) => {
  const params = { pathOfManifest: 'tests/testFiles/parseManifestXmlTests/captivate/scoWithoutQuiz/imsmanifest.xml' };
  parseManifestXml(params, (err, result) => {
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

test('Parses expected information from Camtasia SCO with quiz', (t) => {
  const params = { pathOfManifest: 'tests/testFiles/parseManifestXmlTests/camtasia/scoWithQuiz/imsmanifest.xml' };
  parseManifestXml(params, (err, result) => {
    t.notOk(err, 'Should not error');
    t.ok(result, 'Should receive information parsed from the manifest XML');
    t.equal(result.pathOfManifest, params.pathOfManifest, 'Should return the path of the manifest');
    t.equal(result.scoHtmlHref, 'Camtasia with Quiz.html', 'got a starting point');
    t.equal(result.quizCount, 1, 'Recognize a quiz exists in the sco');
    t.ok(result.thumbnailHref, 'Should find thumbnail');
    t.ok(result.filePaths.indexOf('scripts/config_xml.js') >= 0, 'Should find file referenced in manifest');
    t.end();
  });
});

test('Parses expected information from Camtasia SCO with quiz', (t) => {
  const params = { pathOfManifest: 'tests/testFiles/parseManifestXmlTests/camtasia/scoWithoutQuiz/imsmanifest.xml' };
  parseManifestXml(params, (err, result) => {
    t.notOk(err, 'Should not error');
    t.ok(result, 'Should receive information parsed from the manifest XML');
    t.equal(result.pathOfManifest, params.pathOfManifest, 'Should return the path of the manifest');
    t.equal(result.scoHtmlHref, 'Camtasia with Quiz.html', 'got a starting point');
    t.equal(result.quizCount, 0, 'No quiz');
    t.ok(result.thumbnailHref, 'Should find thumbnail');
    t.ok(result.filePaths.indexOf('scripts/config_xml.js') >= 0, 'Should find file referenced in manifest');
    t.end();
  });
});
