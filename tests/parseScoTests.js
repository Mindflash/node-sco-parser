var test = require('tap').test;

test("parsing always returns an object", function(t) {
	var parser = require("../parseSco.js");
	parser(null, function(err, result) {
		t.ok(result);
		t.end();
	});
});