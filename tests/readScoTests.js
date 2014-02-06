var test = require("tap").test;

test("SCORM module should export expected app interface", function(t) {
	t.ok(require("../index.js"), "Obj is valid");
	t.end();
});