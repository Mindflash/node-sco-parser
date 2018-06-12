/* eslint-disable consistent-return */
const fs = require('fs');
const fstools = require('fs-tools');
const parseString = require('xml2js').parseString;
const DOMParser = require('xmldom').DOMParser;

module.exports = (params, cb) => {
  const p = params || {};
  if (!p.pathToExtractZip) return cb('Requires a path in which to find the SCO manifest XML');
  if (!fs.existsSync(p.pathToExtractZip)) return cb('Path in which to find the SCO manifest XML does not exist');

  const errors = [];
  const parser = new DOMParser({
    errorHandler: (key, msg) => errors.push(key, msg)
  });
  p.pathOfManifest = null;
  fstools.walkSync(p.pathToExtractZip, (path) => {
    if (path.indexOf('imsmanifest.xml') >= 0) {
      p.pathOfManifest = path;
    }
  });
  if (!p.pathOfManifest) return cb('Could not find manifest');

  fs.readFile(p.pathOfManifest, (err, data) => {
    if (err) return cb(err);
    const xmlStringSerialized = parser.parseFromString(data.toString(), 'text/xml');
    if (errors.length) {
      return cb('Invalid tag name');
    }
    parseString(xmlStringSerialized, cb);
  });
};
