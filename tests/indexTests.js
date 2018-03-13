/* eslint-disable no-shadow, comma-dangle, prefer-destructuring */
const fs = require('fs');
const scoParserIndex = require('../index.js');
const test = require('tap').test;

const params = {
  pathToScoZip: 'tests/testFiles/unpackScoZipTests/articulate_sco_with_quiz.zip',
  pathToExtractZip: 'tests/testFiles/unpackScoZipTests/extractFolder'
};

test('Successfully unpacks SCO zip file, validates imsmanifest.xml, and parses it for information', (t) => {
  const scoParser = scoParserIndex(params);
  t.test('Should extract SCO zip file and validate imsmanifest.xml', (t) => {
    scoParser.validate((err, result) => {
      t.notOk(err, 'Should not error');
      t.ok(fs.existsSync(params.pathToExtractZip), 'Should have created path in which to extract zip');
      t.ok(result, 'Should receive result');
      t.ok(result.manifest, 'Should receive manifest data');
      t.end();
    });
  });

  t.test('Should parse imsmanifest.xml to find base html file', (t) => {
    scoParser.parse((err, result) => {
      t.notOk(err, 'Should not error');
      t.ok(result, 'Should receive information parsed from the manifest XML');
      t.equal(result.scoHtmlHref, 'index_lms.html', 'Should receive the SCO\'s start-up HTML file from the manifest');
      t.equal(result.quizCount, 1, 'Finds a quiz in the sco');
      t.end();
    });
  });

  t.test('Should process SCO', (t) => {
    scoParser.process((err) => {
      t.notOk(err, 'Should not error');
      t.end();
    });
  });

  t.test('Deletes folder in which to unzip the files', (t) => {
    scoParser.destroy((err) => {
      t.notOk(err, 'failed to remove directory where files were unzipped to');
      t.end();
    });
  });

  t.end();
});
