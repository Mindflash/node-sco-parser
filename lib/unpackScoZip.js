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
  // eslint-disable-next-line
  rimraf(path.join(p.pathToExtractZip, '__MACOSX'), (err) => {
    if(err){
      console.error("rim raf error", err);
    }
    cb();
  });
};
