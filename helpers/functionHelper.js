"use script";
var _ = require ('lodash');

module.exports.wrapWithCb = function(fn) {
	var newArgs = _.rest(arguments, 1);
	return function (cb) {
		newArgs.push(cb);
		fn.apply(null, newArgs);
	};
}