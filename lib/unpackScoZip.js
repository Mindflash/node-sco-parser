const AdmZip = require('adm-zip');
var path = require("path");
const fs = require('fs');
const rimraf = require('rimraf');
const {
  promisify
} = require('bluebird');
const fsAccess = promisify(fs.access);

module.exports = (params, cb) => {
  const p = params || {};
  if (!p.pathToScoZip) return cb('Requires a path to the SCO\'s zip file');
  if (!p.pathToExtractZip) return cb('Requires a path in which to extract the SCO zip file');

  try {
    const zip = new AdmZip(p.pathToScoZip);
    zip.extractAllTo(p.pathToExtractZip, true);
  } catch (err) {
    // console.error('err = ' + err);
    return cb(err);
  }
  try {
    // eslint-disable-next-line
    fsAccess(path.join(p.pathToScoZip, '__MACOSX'), fs.constants.R_OK | fs.constants.W_OK).then(
      () => {
        //__MACOSX folder exists delete it
        rimraf(path.join(p.pathToScoZip, '__MACOSX'), cb)
      }
    )
  } catch (err) {
    return cb();
  }
};