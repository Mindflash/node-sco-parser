/* eslint-disable consistent-return, comma-dangle */
const _ = require('lodash');
const async = require('async');
const rmrf = require('rimraf');
const processSco = require('./lib/processSco.js');
const parseManifestXml = require('./lib/parseManifestXml.js');
const readManifestXml = require('./lib/readManifestXml.js');
const unpackScoZip = require('./lib/unpackScoZip.js');

function scoParser(params) {
  const p = params || {};

  function validate(cb) {
    async.series({
      unpackScoZip: _.curry(unpackScoZip)(p),
      manifest: _.curry(readManifestXml)(p)
    }, (err, result) => {
      if (err) cb(err);
      cb(null, result.manifest);
    });
  }

  function parse(cb) {
    parseManifestXml(p, cb);
  }

  function process(cb) {
    processSco(p, cb);
  }

  function destroy(cb) {
    if (!p.pathToExtractZip) return cb();
    rmrf(p.pathToExtractZip, cb);
  }

  return {
    validate,
    parse,
    process,
    destroy
  };
}

module.exports = scoParser;
