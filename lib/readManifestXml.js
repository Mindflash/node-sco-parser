/* eslint-disable consistent-return */
const fs = require('fs');
const fstools = require('fs-tools');
const xml2js = require('xml2js');

module.exports = (params, cb) => {
  const p = params || {};
  if (!p.pathToExtractZip) return cb('Requires a path in which to find the SCO manifest XML');
  if (!fs.existsSync(p.pathToExtractZip)) return cb('Path in which to find the SCO manifest XML does not exist');

  const parser = new xml2js.Parser();
  p.pathOfManifest = null;
  fstools.walkSync(p.pathToExtractZip, (path) => {
    if (path.indexOf('imsmanifest.xml') >= 0) { p.pathOfManifest = path; }
  });
  if (!p.pathOfManifest) return cb('Could not find manifest');

  fs.readFile(p.pathOfManifest, (err, data) => {
    if (err) return cb(err);
    try {
      parser.parseString(data, cb);
    } catch (e) {
      // Need to catch errors here. The parser appears to sometimes call the callback
      // and then throw an error. Catch the thrown error here since we've already
      // called back with an error.
    }
  });
};
