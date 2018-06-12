/* eslint-disable prefer-destructuring */
const test = require('tap').test;
const readManifestXml = require('../lib/readManifestXml');

const testFolder = 'tests/testFiles/readManifestXmlTests';

test('Validating the SCO will fail when initialized without params', (t) => {
  readManifestXml(null, (err) => {
    t.ok(err, 'Should error');
    t.equal(err, 'Requires a path in which to find the SCO manifest XML', 'Should give message about needing a path for the SCO XML');
    t.end();
  });
});

test('Validating the SCO will fail when the path in which to find the imsmanifest.xml does not exist', (t) => {
  const params = { pathToExtractZip: '/fake/path' };
  readManifestXml(params, (err) => {
    t.ok(err, 'Should error');
    t.equal(err, 'Path in which to find the SCO manifest XML does not exist', 'Should error about not being able to open the file');
    t.end();
  });
});

test('Validating the SCO will fail when the path in which to find the imsmanifest.xml does not contain imsmanifest.xml', (t) => {
  const params = { pathToExtractZip: `${testFolder}/hasNoManifest` };
  readManifestXml(params, (err) => {
    t.ok(err, 'Should error');
    t.equal(err, 'Could not find manifest', 'Should error about not being able to open the file');
    t.end();
  });
});

test('Validating the SCO will fail when imsmanifest.xml is not actually XML', (t) => {
  const params = { pathToExtractZip: `${testFolder}/notXML` };
  readManifestXml(params, (err) => {
    t.ok(err, 'Should error');
    t.ok(err.message.indexOf('Cannot read property') >= 0, 'Should error because it\'s not XML');
    t.end();
  });
});

test('Validating the SCO will succeed when imsmanifest.xml is valid XML', (t) => {
  const params = { pathToExtractZip: `${testFolder}/isXML` };
  readManifestXml(params, (err, result) => {
    t.notOk(err, 'Should not error');
    t.ok(result, 'Should receive XML JSONified');
    t.equal(result.manifest.resources[0].resource[0].$.href, 'index_lms.html', 'Should find the main html file');
    t.equal(params.pathOfManifest, `${testFolder}/isXML/imsmanifest.xml`, 'Finds path to imsmanifest.xml');
    t.end();
  });
});

test('Finds the imsmanifest.xml even if it\'s buried in subdirectories', (t) => {
  const params = { pathToExtractZip: `${testFolder}/manifestInSubDirectory` };
  readManifestXml(params, (err, result) => {
    t.notOk(err, 'Should not error');
    t.ok(result, 'Should receive XML JSONified');
    t.equal(result.manifest.resources[0].resource[0].$.href, 'index_lms.html', 'Should find the main html file');
    t.equal(params.pathOfManifest, `${testFolder}/manifestInSubDirectory/subdirectory/imsmanifest.xml`, 'Finds path to imsmanifest.xml');
    t.end();
  });
});

test('Validating the SCO will succeed when imsmanifest.xml has ampersand XML character', (t) => {
  const params = { pathToExtractZip: `${testFolder}/ampersand` };
  readManifestXml(params, (err, result) => {
    t.notOk(err, 'Should not error');
    t.ok(result, 'Should receive XML JSONified');
    t.equal(result.manifest.resources[0].resource[0].$.href, 'Policy 1.html', 'Should find the main html file');
    t.equal(params.pathOfManifest, `${testFolder}/ampersand/imsmanifest.xml`, 'Finds path to imsmanifest.xml');
    t.end();
  });
});

test('Validating the SCO will succeed when imsmanifest.xml has greaterthan XML character', (t) => {
  const params = { pathToExtractZip: `${testFolder}/greaterthan` };
  readManifestXml(params, (err, result) => {
    t.notOk(err, 'Should not error');
    t.ok(result, 'Should receive XML JSONified');
    t.equal(result.manifest.resources[0].resource[0].$.href, 'Policy 1.html', 'Should find the main html file');
    t.equal(params.pathOfManifest, `${testFolder}/greaterthan/imsmanifest.xml`, 'Finds path to imsmanifest.xml');
    t.end();
  });
});

test('Validating the SCO will succeed when imsmanifest.xml has singlequotes XML character', (t) => {
  const params = { pathToExtractZip: `${testFolder}/singlequotes` };
  readManifestXml(params, (err, result) => {
    t.notOk(err, 'Should not error');
    t.ok(result, 'Should receive XML JSONified');
    t.equal(result.manifest.resources[0].resource[0].$.href, 'Policy 1.html', 'Should find the main html file');
    t.equal(params.pathOfManifest, `${testFolder}/singlequotes/imsmanifest.xml`, 'Finds path to imsmanifest.xml');
    t.end();
  });
});

test('Validating the SCO will succeed when imsmanifest.xml has doublequotes XML character', (t) => {
  const params = { pathToExtractZip: `${testFolder}/doublequotes` };
  readManifestXml(params, (err, result) => {
    t.ok(err, 'Should error');
    t.end();
  });
});

test('Validating the SCO will succeed when imsmanifest.xml has lessthan XML character', (t) => {
  const params = { pathToExtractZip: `${testFolder}/lessthan` };
  readManifestXml(params, (err, result) => {
    t.ok(err, 'Should error');
    t.end();
  });
});
