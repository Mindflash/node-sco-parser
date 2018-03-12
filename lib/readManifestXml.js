'use script';
var fs = require('fs');
var fstools = require('fs-tools');
var xml2js = require('xml2js');

module.exports = function (params, cb) {
  var params = params || {};
  if (!params.pathToExtractZip) return cb('Requires a path in which to find the SCO manifest XML');
  if (!fs.existsSync(params.pathToExtractZip)) return cb('Path in which to find the SCO manifest XML does not exist');

  var parser = new xml2js.Parser();
  params.pathOfManifest = null;
  fstools.walkSync(params.pathToExtractZip, function (path, stats) {
    if (path.indexOf('imsmanifest.xml') >= 0)
      params.pathOfManifest = path;
  });
  if (!params.pathOfManifest) return cb('Could not find manifest');

  fs.readFile(params.pathOfManifest, function (err, data) {
    if (err) return cb(err);
    try {
      parser.parseString(data, cb);
    } catch (err) {
      // Need to catch errors here. The parser appears to sometimes call the callback and then throw an error.
      // Catch the thrown error here since we've already called back with an error.
    }
  });
};
