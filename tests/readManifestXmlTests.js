"use strict";
var test = require('tap').test;
var readManifestXml = require('../lib/readManifestXml');
var testFolder = 'testFiles/readManifestXmlTests';
var _ = require('lodash');

test('Validating the SCO will fail when initialized without params', function (t) {
	readManifestXml(null, function (err, result) {
		t.ok(err, 'Should error');
		t.equal(err, 'Requires a path in which to find the SCO manifest XML', 'Should give message about needing a path for the SCO XML');
		t.end();
	});
});

test('Validating the SCO will fail when the path in which to find the imsmanifest.xml does not exist', function (t) {
	var params = {pathToExtractZip: '/fake/path'};
	readManifestXml(params, function (err, result) {
		t.ok(err, 'Should error');
		t.ok(_.contains(err.message, 'ENOENT'), 'Should error aobut not being able to open the file');
		t.ok(_.contains(err.message, 'fake'), 'Should error aobut not being able to open the file');
		t.end();
	});
});

test('Validating the SCO will fail when imsmanifest.xml is not actually XML', function (t) {
	var params = {pathToExtractZip: testFolder + '/notXML'};
	readManifestXml(params, function (err, result) {
		t.ok(err, 'Should error');
		t.ok(err.message.indexOf('Non-whitespace before first tag.') >= 0, 'Should error because it\'s not XML');
		t.end();
	});
});

test('Validating the SCO will succeed when imsmanifest.xml is valid XML', function (t) {
	var params = {pathToExtractZip: testFolder + '/isXML'};
	readManifestXml(params, function (err, result) {
		t.notOk(err, 'Should not error');
		t.ok(result, 'Should receive XML JSONified');
		t.equal(result.manifest.resources[0].resource[0].$.href, 'index_lms.html', 'Should find the main html file');
		t.end();
	});
});