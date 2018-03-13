/* eslint-disable no-shadow, comma-dangle, prefer-destructuring */
const fs = require('fs');
const test = require('tap').test;
const unpackScoZip = require('../lib/unpackScoZip');

const testFolder = 'tests/testFiles/unpackScoZipTests';
const pathToExtractZip = 'tests/testFiles/unpackScoZipTests/extractFolder';
const rmrf = require('rimraf');

test('Unpacking the SCO zip file will fail when initialized without params', (t) => {
  unpackScoZip(null, (err) => {
    t.ok(err, 'Should error');
    t.equal(err, 'Requires a path to the SCO\'s zip file', 'Should give needs a SCO path message');
    t.end();
  });
});

test('Unpacking the SCO zip file will fail when initialized without a path to the SCO\'s zip file', (t) => {
  const params = { pathToExtractZip };
  unpackScoZip(params, (err) => {
    t.ok(err, 'Should error');
    t.equal(err, 'Requires a path to the SCO\'s zip file', 'Should give needs a SCO path message');
    t.end();
  });
});

test('Unpacking the SCO zip file will fail when initialized without a path in which to extract the zip', (t) => {
  const params = { pathToScoZip: `${testFolder}/articulate_sco_with_quiz.zip` };
  unpackScoZip(params, (err) => {
    t.ok(err, 'Should error');
    t.equal(err, 'Requires a path in which to extract the SCO zip file', 'Should give needs a path in which to unzip message');
    t.end();
  });
});

test('Unpacking the SCO zip file will fail when path to SCO zip does not exist', (t) => {
  const params = {
    pathToScoZip: '/path/to/fakepath.zip',
    pathToExtractZip
  };
  unpackScoZip(params, (err) => {
    t.ok(err, 'Should error');
    t.equal(err, 'Invalid filename', 'Should error due to path in which to extract that zip\'s non-existence');
    t.end();
  });
});

test('Unpacking the SCO zip file will fail when the file is not a zip file', (t) => {
  const params = {
    pathToScoZip: `${testFolder}/TheDude.jpg`,
    pathToExtractZip
  };
  unpackScoZip(params, (err) => {
    t.ok(err, 'Should error');
    t.equal(err, 'Invalid or unsupported zip format. No END header found', 'Should error due to file being a JPG.');
    t.end();
  });
});

test('Unpacking the SCO zip file will succeed when the file exists and is a zip file', (t) => {
  t.test('Should extract the zip', (t) => {
    const params = {
      pathToScoZip: `${testFolder}/articulate_sco_with_quiz.zip`,
      pathToExtractZip
    };
    unpackScoZip(params, (err) => {
      t.notOk(err, 'Should not error');
      t.ok(fs.existsSync(pathToExtractZip), 'Should have created path in which to extract zip');
      t.end();
    });
  });

  t.test('Deletes folder in which to unzip the files', (t) => {
    rmrf(pathToExtractZip, (err) => {
      t.notOk(err, 'failed to remove directory where files were unzipped to');
      t.end();
    });
  });

  t.end();
});
