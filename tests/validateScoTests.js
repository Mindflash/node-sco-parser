"use strict";
var test = require('tap').test;
var validateSco = require('../validateSco.js');
var testFolder = 'testFiles/validateTests';
var _ = require('lodash');

test('Validating the SCO will fail when initialized without params', function(t) {
	validateSco(null, function (err, result) {
		t.ok(err, 'Should error');
		t.equal(err, 'Requires a path in which to find the SCO manifest XML', 'Should give message about needing a path for the SCO XML');
		t.end();
	});
});

test('Validating the SCO will fail when the path in which to find the imsmanifest.xml does not exist', function(t) {
	var params = {pathToExtractZip: '/fake/path'};
	validateSco(params, function (err, result) {
		t.ok(err, 'Should error');
		t.ok(_.contains(err.message, 'ENOENT'), 'Should error aobut not being able to open the file');
		t.ok(_.contains(err.message, 'fake'), 'Should error aobut not being able to open the file');
		t.end();
	});
});

test('Validating the SCO will fail when imsmanifest.xml is not actually XML', function(t) {
	var params = {pathToExtractZip: testFolder + '/notXML'};
	validateSco(params, function (err, result) {
		t.ok(err, 'Should error');
		t.ok(err.message.indexOf('Non-whitespace before first tag.') >= 0, 'Should error because it\'s not XML');
		t.end();
	});
});

test('Validating the SCO will succeed when imsmanifest.xml is valid XML', function(t) {
	var params = {pathToExtractZip: testFolder + '/isXML'};
	validateSco(params, function (err, result) {
		t.notOk(err, 'Should not error');
		t.end();
	});
});